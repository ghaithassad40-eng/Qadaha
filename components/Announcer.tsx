'use client'

import { useEffect, useRef } from 'react'
import { startMusic, duckMusic, restoreMusic } from '@/lib/bgAudio'

interface Props {
  text: string
  avatar?: string
}

function stripEmoji(str: string): string {
  // Remove surrogate pairs (emoji) and variation selectors
  return str.replace(/[\uD800-\uDFFF]|[☀-➿]|[︀-﻿]/g, '').trim()
}

export function Announcer({ text, avatar = '🎙️' }: Props) {
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)

  // Start background music as soon as this component mounts (user has already clicked)
  useEffect(() => {
    startMusic()
  }, [])

  // Load Arabic voice
  useEffect(() => {
    const pick = () => {
      const voices = window.speechSynthesis.getVoices()
      voiceRef.current =
        voices.find(v => v.lang === 'ar-SA') ??
        voices.find(v => v.lang.startsWith('ar')) ??
        null
    }
    pick()
    window.speechSynthesis.addEventListener('voiceschanged', pick)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', pick)
  }, [])

  // Speak and duck music whenever text changes
  useEffect(() => {
    if (!text || typeof window === 'undefined') return
    window.speechSynthesis.cancel()

    const utter = new SpeechSynthesisUtterance(stripEmoji(text))
    utter.lang   = 'ar-SA'
    utter.rate   = 1.05
    utter.pitch  = 1.2
    utter.volume = 1
    if (voiceRef.current) utter.voice = voiceRef.current

    utter.onstart = () => duckMusic()
    utter.onend   = () => restoreMusic()
    utter.onerror = () => restoreMusic()

    const t = setTimeout(() => window.speechSynthesis.speak(utter), 120)
    return () => {
      clearTimeout(t)
      window.speechSynthesis.cancel()
      restoreMusic()
    }
  }, [text])

  return (
    <div className="announcer-wrap">
      <div className="announcer-avatar">{avatar}</div>
      <div>
        <div className="announcer-name">أبو الضحكة – المذيع الخرافي</div>
        <div className="announcer-text">{text}</div>
      </div>
    </div>
  )
}
