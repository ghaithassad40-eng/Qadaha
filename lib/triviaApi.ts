import type { ChallengeItem } from './types'

const BASE = 'https://opentdb.com/api.php'

// ── HTML entity decoder ──────────────────────────────────────────────────────
const ENTITIES: Record<string, string> = {
  '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"',
  '&#039;': "'", '&ldquo;': '"', '&rdquo;': '"',
  '&lsquo;': '‘', '&rsquo;': '’', '&ndash;': '–', '&mdash;': '—',
  '&hellip;': '…', '&trade;': '™', '&copy;': '©', '&reg;': '®',
}
function decode(str: string): string {
  return str.replace(/&[^;]+;/g, m => ENTITIES[m] ?? m)
}

// ── Module-level cache so questions survive screen changes ───────────────────
const cache: Record<'kids' | 'adults', ChallengeItem[]> = { kids: [], adults: [] }
const inFlight: Record<'kids' | 'adults', boolean> = { kids: false, adults: false }

async function fetchBatch(difficulty: 'easy' | 'medium', amount = 50): Promise<ChallengeItem[]> {
  const url = `${BASE}?amount=${amount}&type=multiple&difficulty=${difficulty}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`opentdb ${res.status}`)
  const data = await res.json()
  if (data.response_code !== 0) throw new Error(`opentdb code ${data.response_code}`)

  return data.results.map((q: {
    question: string
    correct_answer: string
    category: string
    difficulty: string
  }) => ({
    q: decode(q.question),
    a: decode(q.correct_answer),
    hint: `📚 ${q.category}`,
  }))
}

/**
 * Returns trivia questions for the given category.
 * Fetches from the API the first time; serves the cache on repeat calls.
 * Never throws — returns an empty array on failure.
 */
export async function getTriviaQuestions(cat: 'kids' | 'adults'): Promise<ChallengeItem[]> {
  if (cache[cat].length > 0) return cache[cat]
  if (inFlight[cat]) return []

  inFlight[cat] = true
  try {
    cache[cat] = await fetchBatch(cat === 'kids' ? 'easy' : 'medium')
  } catch (err) {
    console.warn('[triviaApi] fetch failed, using fallback questions', err)
  } finally {
    inFlight[cat] = false
  }
  return cache[cat]
}

/** Pre-warm the cache without blocking — fire and forget. */
export function prefetchTrivia(cats: ('kids' | 'adults')[]) {
  cats.forEach(c => { getTriviaQuestions(c).catch(() => {}) })
}
