'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { CHALLENGE_TYPES, WHEEL_COLORS } from '@/lib/constants'
import { getAnnouncerLine } from '@/lib/announcer'
import { Announcer } from './Announcer'
import type { Group } from '@/lib/types'

interface Props {
  currentGroup: Group
  onResult: (typeId: string) => void
  onBack: () => void
}

export function WheelScreen({ currentGroup, onResult, onBack }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rotRef = useRef(0)
  const rafRef = useRef<number>()
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [annLine] = useState(() => getAnnouncerLine('spin'))

  const drawWheel = useCallback((rotation: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const cx = canvas.width / 2
    const cy = canvas.height / 2
    const r = cx - 8
    const n = CHALLENGE_TYPES.length
    const slice = (2 * Math.PI) / n
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    CHALLENGE_TYPES.forEach((t, i) => {
      const start = rotation + i * slice
      const end = start + slice
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, r, start, end)
      ctx.closePath()
      ctx.fillStyle = WHEEL_COLORS[i % WHEEL_COLORS.length]
      ctx.fill()
      ctx.strokeStyle = '#0d0b1e'
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(start + slice / 2)
      ctx.textAlign = 'right'
      ctx.fillStyle = '#fff'
      ctx.font = `bold ${Math.floor(canvas.width / 22)}px Cairo, sans-serif`
      ctx.fillText(`${t.icon} ${t.label}`, r - 12, 6)
      ctx.restore()
    })
  }, [])

  useEffect(() => {
    drawWheel(0)
  }, [drawWheel])

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }, [])

  const spin = useCallback(() => {
    if (spinning || result) return
    setSpinning(true)
    const targetIdx = Math.floor(Math.random() * CHALLENGE_TYPES.length)
    const n = CHALLENGE_TYPES.length
    const slice = (2 * Math.PI) / n
    const spinAmount = 6 * 2 * Math.PI + (2 * Math.PI - targetIdx * slice - slice / 2)
    const duration = 3000 + Math.random() * 1200
    const start = performance.now()
    const startRot = rotRef.current

    function animate(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 4)
      const current = startRot + ease * spinAmount
      rotRef.current = current
      drawWheel(current)
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        setSpinning(false)
        setResult(CHALLENGE_TYPES[targetIdx].id)
      }
    }
    rafRef.current = requestAnimationFrame(animate)
  }, [spinning, result, drawWheel])

  const resultType = result ? CHALLENGE_TYPES.find(t => t.id === result) : null

  return (
    <section className="screen wheel-screen">
      <h2>🎰 دور فريق: <span style={{ color: currentGroup.color }}>{currentGroup.name}</span></h2>

      <div className="wheel-container">
        <div className="wheel-pointer">▼</div>
        <canvas ref={canvasRef} className="wheel-canvas" width={320} height={320} />
      </div>

      {!result ? (
        <button
          className="btn btn-gold"
          style={{ fontSize: '1.3rem', padding: '16px 48px' }}
          onClick={spin}
          disabled={spinning}
        >
          {spinning ? '🌀 يدور...' : '🌀 دوّر!'}
        </button>
      ) : (
        <div className="wheel-result-badge">
          <div style={{ fontSize: '2.5rem' }}>{resultType?.icon}</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--gold)', margin: '8px 0' }}>
            {resultType?.label}
          </div>
          <button className="btn btn-gold mt16" onClick={() => onResult(result)}>
            ابدأ التحدي! 🚀
          </button>
        </div>
      )}

      <Announcer text={annLine} avatar="🎰" />

      <button className="btn btn-grey" onClick={onBack}>← رجوع</button>
    </section>
  )
}
