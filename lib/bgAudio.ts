// Module-level singleton so the same audio element persists across screen changes
let audio: HTMLAudioElement | null = null

const MUSIC_VOL  = 0.35  // normal background level
const DUCKED_VOL = 0.07  // while announcer is speaking

function get(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null
  if (!audio) {
    audio = new Audio('/bgmusic.mpeg')
    audio.loop   = true
    audio.volume = MUSIC_VOL
  }
  return audio
}

export function startMusic() {
  const a = get()
  if (!a || !a.paused) return
  a.play().catch(() => {}) // silently ignore autoplay blocks
}

export function duckMusic() {
  const a = get()
  if (a) a.volume = DUCKED_VOL
}

export function restoreMusic() {
  const a = get()
  if (a) a.volume = MUSIC_VOL
}
