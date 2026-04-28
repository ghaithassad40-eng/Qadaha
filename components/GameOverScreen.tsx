import type { Group } from '@/lib/types'
import { getAnnouncerLine } from '@/lib/announcer'
import { Announcer } from './Announcer'
import { Confetti } from './Confetti'

interface Props {
  groups: Group[]
  onRestart: () => void
}

const MEDALS = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣']

export function GameOverScreen({ groups, onRestart }: Props) {
  const sorted = [...groups].sort((a, b) => b.score - a.score)
  const winner = sorted[0]
  const annLine = getAnnouncerLine('gameover')

  return (
    <section className="screen gameover-screen">
      <Confetti active />

      <h1 style={{ color: 'var(--gold)' }}>🏁 انتهت اللعبة!</h1>

      <div className="winner-card">
        <div className="winner-crown">👑</div>
        <div style={{ fontSize: '1.1rem', color: 'var(--sub)' }}>الفائز هو</div>
        <div className="winner-name" style={{ color: winner.color }}>{winner.name}</div>
        <div style={{ fontSize: '1.1rem', color: 'var(--sub)' }}>{winner.score} نقطة 🎉</div>
      </div>

      <div className="final-scores">
        <h3 style={{ marginBottom: 14, color: 'var(--gold)' }}>📊 النتائج النهائية</h3>
        {sorted.map((g, i) => (
          <div key={i} className="final-score-row">
            <div>
              <span className="rank">{MEDALS[i]}</span>{' '}
              <span style={{ color: g.color, fontWeight: 700 }}>{g.name}</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>{g.score}</div>
          </div>
        ))}
      </div>

      <Announcer text={annLine} avatar="🏆" />

      <button
        className="btn btn-gold"
        style={{ fontSize: '1.2rem', padding: '14px 44px' }}
        onClick={onRestart}
      >
        🔄 لعبة جديدة
      </button>
    </section>
  )
}
