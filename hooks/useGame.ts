'use client'

import { useState, useCallback, useEffect } from 'react'
import type { Category, Screen, Group, ActiveChallenge, ResultType, ChallengeItem } from '@/lib/types'
import { CHALLENGE_TYPES, GROUP_COLORS } from '@/lib/constants'
import { DB } from '@/lib/gameData'
import { getAnnouncerLine, AnnouncerContext } from '@/lib/announcer'
import { getTriviaQuestions, prefetchTrivia } from '@/lib/triviaApi'

function buildCtx(
  groups: Group[],
  currentIdx: number,
  winScore: number,
  overrideScore?: number,
): AnnouncerContext {
  const current = groups[currentIdx]
  const others = groups.filter((_, i) => i !== currentIdx)
  const sorted = [...groups].sort((a, b) => b.score - a.score)
  const currentScore = overrideScore ?? current.score
  return {
    team:    current.name,
    others:  others.map(g => g.name),
    leader:  sorted[0].name,
    lagging: sorted[sorted.length - 1].name,
    score:   currentScore,
    gap:     sorted[0].score - (sorted[1]?.score ?? 0),
    winScore,
  }
}

export function useGame() {
  const [screen, setScreen] = useState<Screen>('welcome')
  const [category, setCategory] = useState<Category>('adults')
  const [groups, setGroups] = useState<Group[]>([])
  const [winScore, setWinScore] = useState(10)
  const [currentGroupIdx, setCurrentGroupIdx] = useState(0)
  const [round, setRound] = useState(1)
  const [activeChallenge, setActiveChallenge] = useState<ActiveChallenge | null>(null)
  const [usedChallenges, setUsedChallenges] = useState<Record<string, number[]>>({})
  const [announcerLine, setAnnouncerLine] = useState(getAnnouncerLine('welcome'))

  // API question pools — keyed by 'kids' | 'adults'
  const [apiQuestions, setApiQuestions] = useState<Record<string, ChallengeItem[]>>({})
  const [questionsReady, setQuestionsReady] = useState(false)

  // Pre-fetch as soon as a category is chosen on the welcome screen
  useEffect(() => {
    const cats: ('kids' | 'adults')[] = category === 'mixed' ? ['kids', 'adults']
      : [category as 'kids' | 'adults']
    prefetchTrivia(cats)
  }, [category])

  /** Resolve which DB category key to use (handles 'mixed'). */
  function resolvecat(): 'kids' | 'adults' {
    if (category === 'mixed') return Math.random() < 0.5 ? 'kids' : 'adults'
    return category as 'kids' | 'adults'
  }

  const startGame = useCallback(async (groupNames: string[], targetScore: number) => {
    const newGroups = groupNames.map((name, i) => ({ name, score: 0, color: GROUP_COLORS[i] }))
    setGroups(newGroups)
    setWinScore(targetScore)
    setCurrentGroupIdx(0)
    setRound(1)
    setUsedChallenges({})
    setQuestionsReady(false)

    // Fetch questions in parallel while player reads the board
    const cats: ('kids' | 'adults')[] = category === 'mixed' ? ['kids', 'adults']
      : [category as 'kids' | 'adults']

    const results = await Promise.all(cats.map(c => getTriviaQuestions(c)))
    const merged: Record<string, ChallengeItem[]> = {}
    cats.forEach((c, i) => { merged[c] = results[i] })
    setApiQuestions(merged)
    setQuestionsReady(true)

    const others = newGroups.slice(1).map(g => g.name)
    setAnnouncerLine(getAnnouncerLine('turn', {
      team: newGroups[0].name,
      others,
      leader: newGroups[0].name,
      lagging: newGroups[newGroups.length - 1].name,
      score: 0, gap: 0, winScore: targetScore,
    }))
    setScreen('board')
  }, [category])

  const drawChallenge = useCallback((typeId: string) => {
    const type = CHALLENGE_TYPES.find(t => t.id === typeId)!
    const catKey = resolvecat()
    const catData = DB[catKey]

    // For 'question', prefer API pool; fall back to DB if not loaded yet
    let pool: ChallengeItem[]
    if (typeId === 'question') {
      const apiPool = apiQuestions[catKey] ?? []
      pool = apiPool.length > 0 ? apiPool : catData.question
    } else {
      pool = (catData[typeId as keyof typeof catData] ?? []) as ChallengeItem[]
    }

    if (pool.length === 0) return

    const used = usedChallenges[typeId] ?? []
    const available = pool.map((item, i) => ({ item, i })).filter(({ i }) => !used.includes(i))

    let chosen: { item: ChallengeItem; i: number }
    if (available.length === 0) {
      const idx = Math.floor(Math.random() * pool.length)
      chosen = { item: pool[idx], i: idx }
      setUsedChallenges(prev => ({ ...prev, [typeId]: [idx] }))
    } else {
      chosen = available[Math.floor(Math.random() * available.length)]
      setUsedChallenges(prev => ({ ...prev, [typeId]: [...used, chosen.i] }))
    }

    setActiveChallenge({ type, item: chosen.item })
    const ctx = buildCtx(groups, currentGroupIdx, winScore)
    setAnnouncerLine(getAnnouncerLine(typeId, ctx))
    setScreen('challenge')
  }, [category, usedChallenges, groups, currentGroupIdx, winScore, apiQuestions])

  const submitResult = useCallback((result: ResultType) => {
    const newScore = result === 'correct'
      ? groups[currentGroupIdx].score + 1
      : groups[currentGroupIdx].score

    const updatedGroups = groups.map((g, i) =>
      i === currentGroupIdx && result === 'correct' ? { ...g, score: newScore } : g
    )
    setGroups(updatedGroups)

    const ctx = buildCtx(updatedGroups, currentGroupIdx, winScore, newScore)

    if (newScore >= winScore) {
      setAnnouncerLine(getAnnouncerLine('gameover', ctx))
      setScreen('gameover')
      return
    }

    let annType = result === 'correct'
      ? (newScore >= winScore - 1 ? 'pressure' : 'correct')
      : result === 'wrong' ? 'wrong' : 'skip'
    let line = getAnnouncerLine(annType, ctx)

    const sorted = [...updatedGroups].sort((a, b) => b.score - a.score)
    const gap = sorted[0].score - (sorted[1]?.score ?? 0)
    if (result === 'correct' && gap >= 3 && sorted[0].name === groups[currentGroupIdx].name) {
      line = getAnnouncerLine('leading', ctx)
    } else if (result === 'correct' && gap <= 1 && sorted[0].score > 0) {
      line = getAnnouncerLine('close', ctx)
    } else if (result === 'correct' && newScore > 1 && gap <= 0) {
      line = getAnnouncerLine('comeback', ctx)
    }

    setAnnouncerLine(line)
    const nextIdx = (currentGroupIdx + 1) % groups.length
    if (nextIdx === 0) setRound(r => r + 1)
    setCurrentGroupIdx(nextIdx)
    setScreen('board')
  }, [currentGroupIdx, groups, winScore])

  const goToWheel = useCallback(() => {
    if (groups.length === 0) return
    const ctx = buildCtx(groups, currentGroupIdx, winScore)
    setAnnouncerLine(getAnnouncerLine('spin', ctx))
    setScreen('wheel')
  }, [groups, currentGroupIdx, winScore])

  const endGame = useCallback(() => {
    const ctx = buildCtx(groups, currentGroupIdx, winScore)
    setAnnouncerLine(getAnnouncerLine('gameover', ctx))
    setScreen('gameover')
  }, [groups, currentGroupIdx, winScore])

  const restart = useCallback(() => {
    setGroups([])
    setCurrentGroupIdx(0)
    setRound(1)
    setActiveChallenge(null)
    setUsedChallenges({})
    setApiQuestions({})
    setQuestionsReady(false)
    setAnnouncerLine(getAnnouncerLine('welcome'))
    setScreen('welcome')
  }, [])

  return {
    screen, setScreen,
    category, setCategory,
    groups,
    winScore,
    currentGroupIdx,
    round,
    activeChallenge,
    announcerLine, setAnnouncerLine,
    questionsReady,
    startGame,
    drawChallenge,
    submitResult,
    goToWheel,
    endGame,
    restart,
  }
}
