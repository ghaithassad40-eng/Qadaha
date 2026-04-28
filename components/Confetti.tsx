'use client'

import { useState, useEffect } from 'react'

interface Piece {
  id: number
  left: string
  color: string
  width: string
  height: string
  duration: string
}

const COLORS = ['#ffd700', '#f97316', '#a855f7', '#22c55e', '#ef4444', '#3b82f6', '#ec4899']

export function Confetti({ active }: { active: boolean }) {
  const [pieces, setPieces] = useState<Piece[]>([])

  useEffect(() => {
    if (!active) return
    const newPieces: Piece[] = Array.from({ length: 120 }, (_, i) => ({
      id: i,
      left: Math.random() * 100 + 'vw',
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      width: (8 + Math.random() * 8) + 'px',
      height: (8 + Math.random() * 8) + 'px',
      duration: (2 + Math.random() * 3) + 's',
    }))
    setPieces(newPieces)
    const t = setTimeout(() => setPieces([]), 6000)
    return () => clearTimeout(t)
  }, [active])

  return (
    <>
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{ left: p.left, background: p.color, width: p.width, height: p.height, animationDuration: p.duration }}
        />
      ))}
    </>
  )
}
