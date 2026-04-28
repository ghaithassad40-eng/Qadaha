import type { Group } from '@/lib/types'
import { Announcer } from './Announcer'

interface Props {
  groups: Group[]
  currentGroupIdx: number
  round: number
  winScore: number
  announcerLine: string
  onDraw: () => void
  onEndGame: () => void
}

export function BoardScreen({
  groups, currentGroupIdx, round, winScore, announcerLine, onDraw, onEndGame,
}: Props) {
  const current = groups[currentGroupIdx]

  return (
    <section className="screen board-screen">
      <div className="board-header">
        <h1 style={{ fontSize: '2rem', color: 'var(--gold)' }}>🏆 قدها!</h1>
        <div className="round-badge">الجولة {round}</div>
      </div>

      <div className="groups-grid">
        {groups.map((g, i) => {
          const pct = Math.min(g.score / winScore, 1)
          const isActive = i === currentGroupIdx
          return (
            <div
              key={i}
              className={`group-score-card${isActive ? ' active-turn' : ''}`}
              style={{
                borderColor: isActive ? g.color : 'transparent',
                boxShadow: isActive ? `0 0 24px ${g.color}55` : undefined,
              }}
            >
              {isActive && <div className="g-turn-label">دوري</div>}
              <div className="g-name" style={{ color: g.color }}>{g.name}</div>
              <div className="g-score">{g.score}</div>
              <div style={{ background: '#13112a', borderRadius: 8, height: 6, marginTop: 8, overflow: 'hidden' }}>
                <div style={{ background: g.color, height: '100%', width: `${pct * 100}%`, transition: 'width .6s', borderRadius: 8 }} />
              </div>
              <div style={{ fontSize: '.75rem', color: 'var(--sub)', marginTop: 4 }}>الهدف: {winScore}</div>
            </div>
          )
        })}
      </div>

      <div className="current-turn-banner">
        دور الفريق: <span style={{ color: current?.color }}>{current?.name}</span>
      </div>

      <Announcer text={announcerLine} />

      <div className="gap-row">
        <button className="btn btn-purple" style={{ fontSize: '1.2rem', padding: '14px 44px' }} onClick={onDraw}>
          🎰 سحب التحدي
        </button>
        <button className="btn btn-grey" onClick={onEndGame}>⛳ إنهاء اللعبة</button>
      </div>
    </section>
  )
}
