import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProfile } from '../../profiles/ProfileContext'
import { wordChallenges, getWordLevelForProfile } from '../../data/wordLists'

const ROUNDS_PER_GAME = 5
const TIME_LIMIT = 10 // seconds per question

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function WordDash() {
  const { currentProfile, addStars, addBadge, updateProgress } = useProfile()
  const [gameState, setGameState] = useState('ready')
  const [challenges, setChallenges] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [level, setLevel] = useState(1)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [eggmanProgress, setEggmanProgress] = useState(0)

  useEffect(() => {
    if (currentProfile) {
      const { startLevel } = getWordLevelForProfile(currentProfile)
      const savedLevel = currentProfile.progress.reading.level || startLevel
      setLevel(savedLevel)
    }
  }, [currentProfile])

  // Timer
  useEffect(() => {
    if (gameState !== 'playing' || feedback) return
    if (timeLeft <= 0) {
      // Time's up — count as wrong
      setEggmanProgress(p => Math.min(p + 20, 100))
      setFeedback('timeout')
      setTimeout(() => {
        setFeedback(null)
        if (currentIndex + 1 >= ROUNDS_PER_GAME) {
          finishGame(score)
        } else {
          setCurrentIndex(i => i + 1)
          setTimeLeft(TIME_LIMIT)
        }
      }, 1200)
      return
    }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(timer)
  }, [gameState, timeLeft, feedback])

  const startGame = useCallback(() => {
    const levelChallenges = wordChallenges[level] || wordChallenges[1]
    const selected = shuffle(levelChallenges).slice(0, ROUNDS_PER_GAME)
    const withShuffledChoices = selected.map(c => ({
      ...c,
      choices: shuffle(c.choices)
    }))
    setChallenges(withShuffledChoices)
    setCurrentIndex(0)
    setScore(0)
    setFeedback(null)
    setTimeLeft(TIME_LIMIT)
    setEggmanProgress(0)
    setGameState('playing')
  }, [level])

  function handleAnswer(choice) {
    if (feedback) return
    const challenge = challenges[currentIndex]
    const isCorrect = choice === challenge.answer

    if (isCorrect) {
      setScore(s => s + 1)
      setFeedback('correct')
    } else {
      setEggmanProgress(p => Math.min(p + 20, 100))
      setFeedback('wrong')
    }

    setTimeout(() => {
      setFeedback(null)
      if (currentIndex + 1 >= ROUNDS_PER_GAME) {
        finishGame(isCorrect ? score + 1 : score)
      } else {
        setCurrentIndex(i => i + 1)
        setTimeLeft(TIME_LIMIT)
      }
    }, 1200)
  }

  function finishGame(finalScore) {
    const starsEarned = finalScore >= 4 ? 3 : finalScore >= 3 ? 2 : finalScore >= 1 ? 1 : 0
    addStars(starsEarned)

    const totalCorrect = (currentProfile.progress.reading.correct || 0) + finalScore
    const totalAttempts = (currentProfile.progress.reading.total || 0) + ROUNDS_PER_GAME

    const { maxLevel } = getWordLevelForProfile(currentProfile)
    let newLevel = level
    if (finalScore >= 4 && level < maxLevel) {
      newLevel = level + 1
    } else if (finalScore <= 1 && level > 1) {
      newLevel = level - 1
    }

    updateProgress('reading', {
      level: newLevel,
      correct: totalCorrect,
      total: totalAttempts,
    })
    setLevel(newLevel)

    if (finalScore === ROUNDS_PER_GAME) {
      addBadge({ name: 'Speed Reader', icon: '📖', subject: 'reading' })
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
          📖
        </motion.div>
        <h2 className="font-game text-2xl text-sonic-yellow text-center">Word Dash</h2>
        <p className="text-blue-200 text-center max-w-md">
          Pick the right answer before Eggman catches Sonic! You have {TIME_LIMIT} seconds per question!
        </p>
        <p className="text-blue-400 text-sm">Level {level}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startGame}
          className="font-game text-lg bg-sonic-yellow text-sonic-dark px-10 py-4 rounded-2xl glow-pulse touch-target"
        >
          DASH!
        </motion.button>
      </div>
    )
  }

  // Complete screen
  if (gameState === 'complete') {
    const starsEarned = score >= 4 ? 3 : score >= 3 ? 2 : score >= 1 ? 1 : 0
    const escaped = eggmanProgress < 100
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring' }}
          className="text-7xl"
        >
          {escaped ? '🦔💨' : '🥚'}
        </motion.div>
        <h2 className="font-game text-xl text-sonic-yellow">
          {escaped ? 'Sonic Escaped!' : 'Eggman Got Close!'}
        </h2>
        <div className="text-4xl font-bold">{score} / {ROUNDS_PER_GAME}</div>
        <div className="text-2xl text-sonic-yellow">
          {'⭐'.repeat(starsEarned)} +{starsEarned} stars
        </div>
        {score === ROUNDS_PER_GAME && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-500/20 border border-blue-500 rounded-xl px-6 py-3 text-blue-300 font-bold"
          >
            🏅 New Badge: Speed Reader!
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
  const challenge = challenges[currentIndex]
  const timePercent = (timeLeft / TIME_LIMIT) * 100
  const timeColor = timeLeft <= 3 ? 'bg-red-500' : timeLeft <= 5 ? 'bg-yellow-500' : 'bg-green-500'

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
      {/* Eggman chase bar */}
      <div className="w-full max-w-md">
        <div className="flex justify-between text-sm mb-1">
          <span>🦔</span>
          <span className="text-red-400 text-xs">Eggman: {eggmanProgress}%</span>
          <span>🥚</span>
        </div>
        <div className="bg-white/10 rounded-full h-3">
          <motion.div
            className="bg-red-500 h-3 rounded-full"
            animate={{ width: `${eggmanProgress}%` }}
          />
        </div>
      </div>

      {/* Timer */}
      <div className="w-full max-w-md flex items-center gap-3">
        <span className="text-sm">⏱️</span>
        <div className="flex-1 bg-white/10 rounded-full h-3">
          <motion.div
            className={`${timeColor} h-3 rounded-full transition-colors`}
            animate={{ width: `${timePercent}%` }}
          />
        </div>
        <span className={`text-sm font-mono font-bold ${timeLeft <= 3 ? 'text-red-400' : 'text-blue-300'}`}>
          {timeLeft}s
        </span>
      </div>

      {/* Progress */}
      <span className="text-sm text-blue-300">{currentIndex + 1} / {ROUNDS_PER_GAME}</span>

      {/* Challenge */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="bg-white/10 rounded-2xl p-8 w-full max-w-lg text-center"
        >
          <p className="text-xs text-blue-400 mb-2 uppercase tracking-wider">{challenge.type.replace('-', ' ')}</p>
          <p className="text-2xl md:text-3xl font-bold mb-8">{challenge.prompt}</p>

          <div className="flex flex-col gap-4">
            {challenge.choices.map((choice, i) => (
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
                    : choice === challenge.answer
                      ? 'bg-green-500/60 border-2 border-green-400'
                      : 'bg-red-500/30 border-2 border-red-400/50'
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
              {feedback === 'correct' ? '🦔💨' : feedback === 'timeout' ? '⏰' : '🥚'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
