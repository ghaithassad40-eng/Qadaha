'use client'

import { useState, useEffect, useRef } from 'react'
import type { ActiveChallenge, Group, ResultType } from '@/lib/types'
import { Announcer } from './Announcer'

interface Props {
  challenge: ActiveChallenge
  currentGroup: Group
  announcerLine: string
  onResult: (r: ResultType) => void
}

const CIRCUMFERENCE = 201 // 2 * PI * 32

export function ChallengeScreen({ challenge, currentGroup, announcerLine, onResult }: Props) {
  const totalTime = challenge.item.time ?? challenge.type.time
  const [timeLeft, setTimeLeft] = useState(totalTime)
  const [running, setRunning] = useState(true)
  const [showAnswer, setShowAnswer] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          setRunning(false)
          setShowResult(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [running])

  const stopTimer = () => {
    clearInterval(intervalRef.current)
    setRunning(false)
    setShowResult(true)
  }

  const pct = timeLeft / totalTime
  const dashOffset = CIRCUMFERENCE * (1 - pct)
  const stroke = pct > 0.5 ? '#ffd700' : pct > 0.25 ? '#f97316' : '#ef4444'

  return (
    <section
      className="screen challenge-screen"
      onClick={() => { if (!showResult) stopTimer() }}
    >
      <div className={`challenge-type-badge ${challenge.type.colorClass}`}>
        {challenge.type.icon} {challenge.type.label}
        <span style={{ color: currentGroup.color, marginRight: 8 }}>– {currentGroup.name}</span>
      </div>

      {/* Timer */}
      <div className="timer-wrap">
        <svg className="timer-ring" width="80" height="80" viewBox="0 0 80 80">
          <circle className="timer-ring-bg" cx="40" cy="40" r="32" />
          <circle
            className="timer-ring-fill"
            cx="40" cy="40" r="32"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            style={{ stroke, transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s' }}
          />
        </svg>
        <div className="timer-number" style={{ color: stroke }}>{timeLeft}</div>
      </div>

      {/* Challenge card */}
      <div className="challenge-card" onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: '3rem', marginBottom: 8 }}>{challenge.type.icon}</div>
        <div className="challenge-q">{challenge.item.q}</div>

        {challenge.item.hint && (
          <div className="challenge-hint">💡 {challenge.item.hint}</div>
        )}

        {/* Answer only visible after teams have given their verdict */}
        {showResult && challenge.type.hasAnswer && challenge.item.a && (
          <>
            <div className={`answer-reveal${showAnswer ? ' show' : ''}`}>
              ✅ الإجابة: {challenge.item.a}
            </div>
            {!showAnswer && (
              <button
                className="btn btn-grey"
                style={{ fontSize: '1rem', padding: '10px 28px', marginBottom: 8 }}
                onClick={e => { e.stopPropagation(); setShowAnswer(true) }}
              >
                👁️ اظهر الإجابة
              </button>
            )}
          </>
        )}
      </div>

      <Announcer text={announcerLine} avatar={challenge.type.icon} />

      {showResult && (
        <div className="result-btns" onClick={e => e.stopPropagation()}>
          <button className="btn btn-green" onClick={() => onResult('correct')}>✅ صح!</button>
          <button className="btn btn-red"   onClick={() => onResult('wrong')}>❌ غلط!</button>
          <button className="btn btn-grey"  onClick={() => onResult('skip')}>⏭️ تخطي</button>
        </div>
      )}

      {!showResult && (
        <p className="text-sub" style={{ marginTop: 8 }}>
          اضغط في أي مكان لإيقاف المؤقت وإظهار الأزرار
        </p>
      )}
    </section>
  )
}
