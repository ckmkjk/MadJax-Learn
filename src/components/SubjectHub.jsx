import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useProfile } from '../profiles/ProfileContext'

const subjects = [
  {
    key: 'math',
    title: 'Ring Counter',
    subtitle: 'Math',
    emoji: '💍',
    desc: 'Collect rings by solving math problems!',
    color: '#FFD700',
    path: '/math',
  },
  {
    key: 'reading',
    title: 'Word Dash',
    subtitle: 'Reading',
    emoji: '📖',
    desc: 'Outrun Eggman with the power of words!',
    color: '#0051A8',
    path: '/reading',
  },
  {
    key: 'writing',
    title: "Tails' Workshop",
    subtitle: 'Writing',
    emoji: '🔧',
    desc: 'Help Tails by writing messages!',
    color: '#E60012',
    path: '/writing',
  },
]

export default function SubjectHub() {
  const navigate = useNavigate()
  const { currentProfile } = useProfile()

  return (
    <div className="max-w-4xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-game text-xl md:text-2xl text-center text-sonic-yellow mb-8 mt-4"
      >
        Choose Your Zone!
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subjects.map((subj, i) => {
          const progress = currentProfile?.progress[subj.key]
          return (
            <motion.button
              key={subj.key}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, type: 'spring' }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(subj.path)}
              className="rounded-2xl p-6 text-left cursor-pointer no-select touch-target flex flex-col gap-3"
              style={{
                background: `linear-gradient(135deg, ${subj.color}33, ${subj.color}11)`,
                border: `2px solid ${subj.color}66`,
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-5xl">{subj.emoji}</span>
                <div>
                  <h3 className="font-game text-sm" style={{ color: subj.color }}>
                    {subj.title}
                  </h3>
                  <p className="text-xs text-blue-300">{subj.subtitle}</p>
                </div>
              </div>
              <p className="text-sm text-blue-200 font-body">{subj.desc}</p>
              {progress && (
                <div className="text-xs text-blue-400 mt-auto">
                  Level {progress.level} {progress.correct > 0 && `• ${progress.correct}/${progress.total} correct`}
                </div>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Badges section */}
      {currentProfile?.badges.length > 0 && (
        <div className="mt-10">
          <h3 className="font-game text-sm text-blue-300 mb-4">Your Badges</h3>
          <div className="flex flex-wrap gap-3">
            {currentProfile.badges.map((badge, i) => (
              <div key={i} className="bg-white/10 rounded-xl px-4 py-2 text-sm flex items-center gap-2">
                <span className="text-xl">{badge.icon}</span>
                <span>{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
