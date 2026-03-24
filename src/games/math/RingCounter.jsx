import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProfile } from '../../profiles/ProfileContext'
import { mathProblems, getProblemsForProfile } from '../../data/mathProblems'

const ROUNDS_PER_GAME = 5

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function RingCounter() {
  const { currentProfile, addStars, addBadge, updateProgress } = useProfile()
  const [gameState, setGameState] = useState('ready') // ready, playing, result, complete
  const [problems, setProblems] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [rings, setRings] = useState(0)
  const [feedback, setFeedback] = useState(null) // 'correct' | 'wrong' | null
  const [level, setLevel] = useState(1)

  useEffect(() => {
    if (currentProfile) {
      const { startLevel } = getProblemsForProfile(currentProfile)
      const savedLevel = currentProfile.progress.math.level || startLevel
      setLevel(savedLevel)
    }
  }, [currentProfile])

  const startGame = useCallback(() => {
    const levelProblems = mathProblems[level] || mathProblems[1]
    const selected = shuffle(levelProblems).slice(0, ROUNDS_PER_GAME)
    // Shuffle choices for each problem
    const withShuffledChoices = selected.map(p => ({
      ...p,
      choices: shuffle(p.choices)
    }))
    setProblems(withShuffledChoices)
    setCurrentIndex(0)
    setScore(0)
    setRings(0)
    setFeedback(null)
    setGameState('playing')
  }, [level])

  function handleAnswer(choice) {
    if (feedback) return // prevent double-tap
    const problem = problems[currentIndex]
    const isCorrect = choice === problem.answer

    if (isCorrect) {
      setScore(s => s + 1)
      setRings(r => r + 3)
      setFeedback('correct')
    } else {
      setFeedback('wrong')
    }

    setTimeout(() => {
      setFeedback(null)
      if (currentIndex + 1 >= ROUNDS_PER_GAME) {
        finishGame(isCorrect ? score + 1 : score)
      } else {
        setCurrentIndex(i => i + 1)
      }
    }, 1200)
  }

  function finishGame(finalScore) {
    const starsEarned = finalScore >= 4 ? 3 : finalScore >= 3 ? 2 : finalScore >= 1 ? 1 : 0
    addStars(starsEarned)

    const totalCorrect = (currentProfile.progress.math.correct || 0) + finalScore
    const totalAttempts = (currentProfile.progress.math.total || 0) + ROUNDS_PER_GAME

    // Level up if 4+ correct
    const { maxLevel } = getProblemsForProfile(currentProfile)
    let newLevel = level
    if (finalScore >= 4 && level < maxLevel) {
      newLevel = level + 1
    } else if (finalScore <= 1 && level > 1) {
      newLevel = level - 1
    }

    updateProgress('math', {
      level: newLevel,
      correct: totalCorrect,
      total: totalAttempts,
    })
    setLevel(newLevel)

    if (finalScore === ROUNDS_PER_GAME) {
      addBadge({ name: 'Ring Master', icon: '💍', subject: 'math' })
    }

    setGameState('complete')
  }

  if (!currentProfile) return null

  // Ready screen
  if (gameState === 'ready') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-8xl"
        >
          💍
        </motion.div>
        <h2 className="font-game text-2xl text-sonic-yellow text-center">Ring Counter</h2>
        <p className="text-blue-200 text-center max-w-md">
          Solve math problems to collect rings! Get 5 right to become a Ring Master!
        </p>
        <p className="text-blue-400 text-sm">Level {level}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startGame}
          className="font-game text-lg bg-sonic-yellow text-sonic-dark px-10 py-4 rounded-2xl glow-pulse touch-target"
        >
          START!
        </motion.button>
      </div>
    )
  }

  // Complete screen
  if (gameState === 'complete') {
    const starsEarned = score >= 4 ? 3 : score >= 3 ? 2 : score >= 1 ? 1 : 0
    const messages = [
      'Keep trying! You got this! 💪',
      'Nice work! ⭐',
      'Great job! ⭐⭐',
      'Amazing! ⭐⭐⭐',
    ]
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-7xl"
        >
          {score === ROUNDS_PER_GAME ? '🏆' : score >= 3 ? '🌟' : '💪'}
        </motion.div>
        <h2 className="font-game text-xl text-sonic-yellow">Zone Complete!</h2>
        <div className="text-4xl font-bold">{score} / {ROUNDS_PER_GAME}</div>
        <div className="text-2xl text-sonic-yellow">
          {'⭐'.repeat(starsEarned)} +{starsEarned} stars
        </div>
        <div className="text-xl text-yellow-400">💍 {rings} rings collected!</div>
        <p className="text-blue-200 text-lg">{messages[starsEarned]}</p>
        {score === ROUNDS_PER_GAME && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-500/20 border border-yellow-500 rounded-xl px-6 py-3 text-yellow-300 font-bold"
          >
            🏅 New Badge: Ring Master!
          </motion.div>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startGame}
          className="font-game text-sm bg-sonic-blue text-white px-8 py-3 rounded-2xl touch-target mt-4"
        >
          PLAY AGAIN
        </motion.button>
      </div>
    )
  }

  // Playing screen
  const problem = problems[currentIndex]
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
      {/* Progress bar */}
      <div className="w-full max-w-md flex items-center gap-3">
        <div className="flex-1 bg-white/10 rounded-full h-3">
          <motion.div
            className="bg-sonic-yellow h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex) / ROUNDS_PER_GAME) * 100}%` }}
          />
        </div>
        <span className="text-sm text-blue-300 font-mono">{currentIndex + 1}/{ROUNDS_PER_GAME}</span>
      </div>

      {/* Rings display */}
      <div className="flex items-center gap-2 text-yellow-400">
        <span className="text-2xl">💍</span>
        <span className="font-bold text-xl">{rings}</span>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="bg-white/10 rounded-2xl p-8 w-full max-w-lg text-center"
        >
          <p className="text-2xl md:text-3xl font-bold mb-8">{problem.question}</p>

          <div className="flex flex-col gap-4">
            {problem.choices.map((choice, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleAnswer(choice)}
                disabled={feedback !== null}
                className={`
                  text-xl font-bold py-4 px-8 rounded-xl touch-target no-select transition-colors
                  ${feedback === null
                    ? 'bg-sonic-blue/60 hover:bg-sonic-blue/80 border-2 border-sonic-blue'
                    : choice === problem.answer
                      ? 'bg-green-500/60 border-2 border-green-400'
                      : feedback === 'wrong'
                        ? 'bg-red-500/30 border-2 border-red-400/50'
                        : 'bg-white/5 border-2 border-white/10'
                  }
                `}
              >
                {choice}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Feedback overlay */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <div className={`text-8xl ${feedback === 'correct' ? 'star-spin' : ''}`}>
              {feedback === 'correct' ? '✅' : '❌'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
