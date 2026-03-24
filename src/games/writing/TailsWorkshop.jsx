import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProfile } from '../../profiles/ProfileContext'
import { writingPrompts, getWritingLevelForProfile } from '../../data/writingPrompts'

const ROUNDS_PER_GAME = 3

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function checkAnswer(input, prompt) {
  const trimmed = input.trim()
  if (!trimmed) return { passed: false, message: 'Type something first!' }

  // If there's an expected answer, check it
  if (prompt.expected) {
    const matches = trimmed.toUpperCase() === prompt.expected.toUpperCase()
    return {
      passed: matches,
      message: matches ? 'Perfect! Great job!' : `Almost! The answer was "${prompt.expected}". Keep trying!`
    }
  }

  // For free-form writing, check minimum word count
  const words = trimmed.split(/\s+/).filter(w => w.length > 0)
  const minWords = prompt.minWords || 1
  if (words.length < minWords) {
    return {
      passed: false,
      message: `Try writing a bit more! Use at least ${minWords} words.`
    }
  }

  return { passed: true, message: 'Awesome writing! Tails loves your message!' }
}

export default function TailsWorkshop() {
  const { currentProfile, addStars, addBadge, updateProgress } = useProfile()
  const [gameState, setGameState] = useState('ready')
  const [prompts, setPrompts] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [level, setLevel] = useState(1)

  useEffect(() => {
    if (currentProfile) {
      const { startLevel } = getWritingLevelForProfile(currentProfile)
      const savedLevel = currentProfile.progress.writing.level || startLevel
      setLevel(savedLevel)
    }
  }, [currentProfile])

  const startGame = useCallback(() => {
    const levelPrompts = writingPrompts[level] || writingPrompts[1]
    setPrompts(shuffle(levelPrompts).slice(0, ROUNDS_PER_GAME))
    setCurrentIndex(0)
    setScore(0)
    setInput('')
    setFeedback(null)
    setGameState('playing')
  }, [level])

  function handleSubmit() {
    if (feedback) return
    const prompt = prompts[currentIndex]
    const result = checkAnswer(input, prompt)

    setFeedback(result)

    if (result.passed) {
      setScore(s => s + 1)
    }

    setTimeout(() => {
      setFeedback(null)
      setInput('')
      if (currentIndex + 1 >= ROUNDS_PER_GAME) {
        finishGame(result.passed ? score + 1 : score)
      } else {
        setCurrentIndex(i => i + 1)
      }
    }, 2000)
  }

  function finishGame(finalScore) {
    const starsEarned = finalScore >= 3 ? 3 : finalScore >= 2 ? 2 : finalScore >= 1 ? 1 : 0
    addStars(starsEarned)

    const totalCompleted = (currentProfile.progress.writing.completed || 0) + finalScore

    const { maxLevel } = getWritingLevelForProfile(currentProfile)
    let newLevel = level
    if (finalScore >= 3 && level < maxLevel) {
      newLevel = level + 1
    } else if (finalScore === 0 && level > 1) {
      newLevel = level - 1
    }

    updateProgress('writing', {
      level: newLevel,
      completed: totalCompleted,
    })
    setLevel(newLevel)

    if (finalScore === ROUNDS_PER_GAME) {
      addBadge({ name: 'Workshop Pro', icon: '🔧', subject: 'writing' })
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
          🔧
        </motion.div>
        <h2 className="font-game text-2xl text-sonic-yellow text-center">Tails' Workshop</h2>
        <p className="text-blue-200 text-center max-w-md">
          Help Tails by writing! Type your answers to help him build amazing inventions!
        </p>
        <p className="text-blue-400 text-sm">Level {level}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startGame}
          className="font-game text-lg bg-sonic-yellow text-sonic-dark px-10 py-4 rounded-2xl glow-pulse touch-target"
        >
          BUILD!
        </motion.button>
      </div>
    )
  }

  // Complete screen
  if (gameState === 'complete') {
    const starsEarned = score >= 3 ? 3 : score >= 2 ? 2 : score >= 1 ? 1 : 0
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring' }}
          className="text-7xl"
        >
          {score === ROUNDS_PER_GAME ? '🛩️' : score >= 2 ? '🔧' : '🔨'}
        </motion.div>
        <h2 className="font-game text-xl text-sonic-yellow">
          {score === ROUNDS_PER_GAME ? "Tails' Invention Complete!" : 'Workshop Session Done!'}
        </h2>
        <div className="text-4xl font-bold">{score} / {ROUNDS_PER_GAME}</div>
        <div className="text-2xl text-sonic-yellow">
          {'⭐'.repeat(starsEarned)} +{starsEarned} stars
        </div>
        {score === ROUNDS_PER_GAME && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500 rounded-xl px-6 py-3 text-red-300 font-bold"
          >
            🏅 New Badge: Workshop Pro!
          </motion.div>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startGame}
          className="font-game text-sm bg-sonic-blue text-white px-8 py-3 rounded-2xl touch-target mt-4"
        >
          BUILD AGAIN
        </motion.button>
      </div>
    )
  }

  // Playing screen
  const prompt = prompts[currentIndex]
  const isExactMatch = !!prompt.expected

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
      {/* Progress */}
      <div className="w-full max-w-md flex items-center gap-3">
        <div className="flex-1 bg-white/10 rounded-full h-3">
          <motion.div
            className="bg-sonic-red h-3 rounded-full"
            animate={{ width: `${(currentIndex / ROUNDS_PER_GAME) * 100}%` }}
          />
        </div>
        <span className="text-sm text-blue-300">{currentIndex + 1}/{ROUNDS_PER_GAME}</span>
      </div>

      {/* Workshop visual */}
      <div className="text-4xl">🦊🔧</div>

      {/* Prompt */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          className="bg-white/10 rounded-2xl p-6 w-full max-w-lg"
        >
          <p className="text-xs text-blue-400 mb-2 uppercase tracking-wider">{prompt.type}</p>
          <p className="text-xl md:text-2xl font-bold mb-2 text-center">{prompt.prompt}</p>
          {prompt.hint && (
            <p className="text-sm text-blue-300 text-center mb-4">💡 Hint: {prompt.hint}</p>
          )}

          <div className="mt-4">
            {isExactMatch ? (
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="Type here..."
                autoFocus
                autoComplete="off"
                autoCapitalize="characters"
                className="w-full text-2xl text-center font-bold bg-white/10 border-2 border-sonic-yellow/50 rounded-xl px-4 py-4 text-white placeholder-blue-400 focus:outline-none focus:border-sonic-yellow"
              />
            ) : (
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type here..."
                autoFocus
                rows={3}
                className="w-full text-lg bg-white/10 border-2 border-sonic-yellow/50 rounded-xl px-4 py-4 text-white placeholder-blue-400 focus:outline-none focus:border-sonic-yellow resize-none"
              />
            )}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={!input.trim() || feedback !== null}
              className="w-full mt-4 font-game text-sm bg-sonic-yellow text-sonic-dark py-3 rounded-xl touch-target disabled:opacity-40"
            >
              SEND TO TAILS!
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`rounded-xl px-6 py-3 text-center font-bold ${
              feedback.passed
                ? 'bg-green-500/20 border border-green-400 text-green-300'
                : 'bg-orange-500/20 border border-orange-400 text-orange-300'
            }`}
          >
            {feedback.passed ? '✅' : '💡'} {feedback.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
