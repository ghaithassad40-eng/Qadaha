'use client'

import type { Category } from '@/lib/types'

interface Props {
  selected: Category
  onSelect: (c: Category) => void
  onNext: () => void
}

const CATS: { id: Category; icon: string; label: string; sub: string }[] = [
  { id: 'kids',   icon: '🧒', label: 'أطفال',  sub: '٦ – ١٢ سنة' },
  { id: 'adults', icon: '🧑', label: 'كبار',   sub: '١٣ سنة فأكثر' },
  { id: 'mixed',  icon: '👨‍👩‍👧', label: 'مختلط', sub: 'الكل مع الكل!' },
]

export function WelcomeScreen({ selected, onSelect, onNext }: Props) {
  return (
    <section className="screen welcome-screen">
      <div style={{ textAlign: 'center' }}>
        <div className="logo-title">قدها!</div>
        <div className="logo-sub">لعبة التحديات العربية</div>
      </div>

      <div className="stars-row">⭐ 🎤 🎭 🎵 ⭐</div>

      <p className="welcome-desc">
        تحديات مجنونة، أسئلة صعبة، غناء، تمثيل، وضحك بلا حدود!<br />
        من <strong className="text-gold">٢ إلى ٨ فرق</strong> – الكل ضد الكل!
      </p>

      <div style={{ width: '100%', maxWidth: 480 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 16 }}>اختر الفئة</h2>
        <div className="category-choice">
          {CATS.map(c => (
            <div
              key={c.id}
              className={`cat-card${selected === c.id ? ' selected' : ''}`}
              onClick={() => onSelect(c.id)}
            >
              <span className="cat-icon">{c.icon}</span>
              {c.label}
              <div className="text-sub mt8">{c.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <button className="btn btn-gold" style={{ fontSize: '1.3rem', padding: '16px 52px' }} onClick={onNext}>
        ابدأ اللعبة 🚀
      </button>
    </section>
  )
}
