import type { ChallengeType } from './types'

export const CHALLENGE_TYPES: ChallengeType[] = [
  { id: 'question', label: 'سؤال وجواب', icon: '❓', colorClass: 'type-question', time: 30, hasAnswer: true },
  { id: 'singing',  label: 'غنّي معنا',   icon: '🎤', colorClass: 'type-singing',  time: 40, hasAnswer: false },
  { id: 'acting',   label: 'مثّل الفيلم', icon: '🎭', colorClass: 'type-acting',   time: 45, hasAnswer: false },
  { id: 'charades', label: 'إشارات',       icon: '🤫', colorClass: 'type-charades', time: 45, hasAnswer: false },
  { id: 'speed',    label: 'تحدي السرعة', icon: '⚡', colorClass: 'type-speed',    time: 15, hasAnswer: false },
  { id: 'dare',     label: 'تحدي جرأة',   icon: '😈', colorClass: 'type-dare',     time: 30, hasAnswer: false },
]

export const GROUP_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#3b82f6', '#a855f7', '#ec4899', '#14b8a6',
]

export const WHEEL_COLORS = [
  '#3b82f6', '#a855f7', '#f59e0b', '#22c55e', '#ef4444', '#0ea5e9',
]
