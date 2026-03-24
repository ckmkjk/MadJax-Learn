import { Outlet, useNavigate } from 'react-router-dom'
import { useProfile } from '../profiles/ProfileContext'
import { useEffect } from 'react'

export default function Layout() {
  const { currentProfile, activeProfile } = useProfile()
  const navigate = useNavigate()

  useEffect(() => {
    if (!activeProfile) navigate('/')
  }, [activeProfile, navigate])

  if (!currentProfile) return null

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-3"
        style={{ background: `${currentProfile.color}44` }}>
        <button
          onClick={() => navigate('/hub')}
          className="font-game text-sm text-sonic-yellow hover:text-white transition-colors"
        >
          ← Hub
        </button>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{currentProfile.avatar}</span>
          <span className="font-bold text-lg">{currentProfile.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl">⭐</span>
          <span className="font-bold text-sonic-yellow">{currentProfile.stars}</span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  )
}
