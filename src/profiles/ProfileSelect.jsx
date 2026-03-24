import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useProfile } from './ProfileContext'

export default function ProfileSelect() {
  const { profiles, selectProfile } = useProfile()
  const navigate = useNavigate()

  function handleSelect(key) {
    selectProfile(key)
    navigate('/hub')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Title */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="text-center mb-12"
      >
        <h1 className="font-game text-3xl md:text-5xl text-sonic-yellow mb-4 drop-shadow-lg">
          MadJax Learn
        </h1>
        <p className="text-lg text-blue-200 font-body">
          Who's playing today?
        </p>
      </motion.div>

      {/* Profile Cards */}
      <div className="flex flex-col sm:flex-row gap-8">
        {Object.entries(profiles).map(([key, profile], i) => (
          <motion.button
            key={key}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.15, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(key)}
            className="glow-pulse rounded-3xl p-8 w-64 flex flex-col items-center gap-4 cursor-pointer no-select touch-target"
            style={{
              background: `linear-gradient(135deg, ${profile.color}cc, ${profile.color}88)`,
              border: `3px solid ${profile.color}`,
            }}
          >
            <span className="text-7xl">{profile.avatar}</span>
            <span className="font-game text-xl text-white">{profile.name}</span>
            <div className="flex items-center gap-2 text-sonic-yellow">
              <span className="text-2xl">⭐</span>
              <span className="font-bold text-lg">{profile.stars}</span>
            </div>
            {profile.streak > 1 && (
              <div className="text-sm text-orange-300 font-bold">
                🔥 {profile.streak} day streak!
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 text-blue-400 text-sm font-body"
      >
        Built with ❤️ by Dad
      </motion.p>
    </div>
  )
}
