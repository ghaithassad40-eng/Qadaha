'use client'

import { useState } from 'react'
import { GROUP_COLORS } from '@/lib/constants'

interface Props {
  onStart: (names: string[], winScore: number) => void
  onBack: () => void
}

export function SetupScreen({ onStart, onBack }: Props) {
  const [count, setCount] = useState(4)
  const [names, setNames] = useState<string[]>(Array.from({ length: 8 }, (_, i) => `الفريق ${i + 1}`))
  const [winScore, setWinScore] = useState(10)

  const updateName = (i: number, val: string) =>
    setNames(prev => prev.map((n, idx) => (idx === i ? val : n)))

  const handleStart = () => {
    const groupNames = names.slice(0, count).map((n, i) => n.trim() || `الفريق ${i + 1}`)
    onStart(groupNames, winScore)
  }

  return (
    <section className="screen setup-screen">
      <h1 style={{ textAlign: 'center', fontSize: '2.2rem', color: 'var(--gold)' }}>⚙️ إعداد اللعبة</h1>

      {/* Group count */}
      <div className="setup-card w100">
        <h3>🏆 عدد الفرق</h3>
        <div className="gap-row">
          {[2, 3, 4, 5, 6, 7, 8].map(n => (
            <button
              key={n}
              className={`btn ${n === count ? 'btn-gold' : 'btn-grey'}`}
              onClick={() => setCount(n)}
            >
              {n} فرق
            </button>
          ))}
        </div>
      </div>

      {/* Group names */}
      <div className="setup-card w100">
        <h3>✍️ أسماء الفرق</h3>
        <div className="group-inputs">
          {Array.from({ length: count }, (_, i) => (
            <div key={i} className="group-row">
              <div className="group-color-dot" style={{ background: GROUP_COLORS[i] }} />
              <input
                type="text"
                value={names[i]}
                onChange={e => updateName(i, e.target.value)}
                placeholder={`اسم الفريق ${i + 1}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Win score */}
      <div className="setup-card w100">
        <h3>🎯 هدف النقاط</h3>
        <div className="points-row">
          <label>الفريق الفائز يصل إلى</label>
          <input
            type="number"
            value={winScore}
            min={3} max={50}
            style={{ maxWidth: 90 }}
            onChange={e => setWinScore(Number(e.target.value))}
          />
          <label>نقطة</label>
        </div>
      </div>

      <div className="gap-row">
        <button className="btn btn-grey" onClick={onBack}>← رجوع</button>
        <button className="btn btn-gold" onClick={handleStart}>انطلق! 🎉</button>
      </div>
    </section>
  )
}
