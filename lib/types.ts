export type Category = 'kids' | 'adults' | 'mixed'
export type Screen = 'welcome' | 'setup' | 'board' | 'wheel' | 'challenge' | 'gameover'
export type ResultType = 'correct' | 'wrong' | 'skip'

export interface Group {
  name: string
  score: number
  color: string
}

export interface ChallengeItem {
  q: string
  a?: string
  hint?: string
  time?: number
}

export interface ChallengeType {
  id: string
  label: string
  icon: string
  colorClass: string
  time: number
  hasAnswer: boolean
}

export interface ActiveChallenge {
  type: ChallengeType
  item: ChallengeItem
}
