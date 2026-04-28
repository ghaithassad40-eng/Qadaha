'use client'

import { useGame } from '@/hooks/useGame'
import { WelcomeScreen } from '@/components/WelcomeScreen'
import { SetupScreen } from '@/components/SetupScreen'
import { BoardScreen } from '@/components/BoardScreen'
import { WheelScreen } from '@/components/WheelScreen'
import { ChallengeScreen } from '@/components/ChallengeScreen'
import { GameOverScreen } from '@/components/GameOverScreen'

export default function QadhaGame() {
  const game = useGame()

  const confirmEndGame = () => {
    if (window.confirm('هل تريد إنهاء اللعبة الآن؟')) game.endGame()
  }

  return (
    <main>
      {game.screen === 'welcome' && (
        <WelcomeScreen
          selected={game.category}
          onSelect={game.setCategory}
          onNext={() => game.setScreen('setup')}
        />
      )}

      {game.screen === 'setup' && (
        <SetupScreen
          onStart={game.startGame}
          onBack={() => game.setScreen('welcome')}
        />
      )}

      {game.screen === 'board' && (
        <BoardScreen
          groups={game.groups}
          currentGroupIdx={game.currentGroupIdx}
          round={game.round}
          winScore={game.winScore}
          announcerLine={game.announcerLine}
          onDraw={game.goToWheel}
          onEndGame={confirmEndGame}
        />
      )}

      {game.screen === 'wheel' && game.groups.length > 0 && (
        <WheelScreen
          currentGroup={game.groups[game.currentGroupIdx]}
          onResult={game.drawChallenge}
          onBack={() => game.setScreen('board')}
        />
      )}

      {game.screen === 'challenge' && game.activeChallenge && (
        <ChallengeScreen
          key={game.activeChallenge.item.q}
          challenge={game.activeChallenge}
          currentGroup={game.groups[game.currentGroupIdx]}
          announcerLine={game.announcerLine}
          onResult={game.submitResult}
        />
      )}

      {game.screen === 'gameover' && (
        <GameOverScreen
          groups={game.groups}
          onRestart={game.restart}
        />
      )}
    </main>
  )
}
