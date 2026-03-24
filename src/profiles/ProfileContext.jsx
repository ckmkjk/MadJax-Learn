import { createContext, useContext, useState, useEffect } from 'react'

const ProfileContext = createContext()

const DEFAULT_PROFILES = {
  maddox: {
    name: 'Maddox',
    age: 7,
    grade: '2nd',
    avatar: '🦔',
    color: '#0051A8',
    stars: 0,
    badges: [],
    streak: 0,
    lastPlayed: null,
    progress: {
      math: { level: 1, correct: 0, total: 0 },
      reading: { level: 1, correct: 0, total: 0 },
      writing: { level: 1, completed: 0 },
    }
  },
  jaxon: {
    name: 'Jaxon',
    age: 5,
    grade: 'K',
    avatar: '🦊',
    color: '#E60012',
    stars: 0,
    badges: [],
    streak: 0,
    lastPlayed: null,
    progress: {
      math: { level: 1, correct: 0, total: 0 },
      reading: { level: 1, correct: 0, total: 0 },
      writing: { level: 1, completed: 0 },
    }
  }
}

function loadProfiles() {
  try {
    const saved = localStorage.getItem('madjax-profiles')
    if (saved) return JSON.parse(saved)
  } catch (e) {
    console.error('Failed to load profiles:', e)
  }
  return DEFAULT_PROFILES
}

function saveProfiles(profiles) {
  try {
    localStorage.setItem('madjax-profiles', JSON.stringify(profiles))
  } catch (e) {
    console.error('Failed to save profiles:', e)
  }
}

export function ProfileProvider({ children }) {
  const [profiles, setProfiles] = useState(loadProfiles)
  const [activeProfile, setActiveProfile] = useState(null)

  useEffect(() => {
    saveProfiles(profiles)
  }, [profiles])

  function selectProfile(key) {
    setActiveProfile(key)
    // Update streak
    const today = new Date().toDateString()
    setProfiles(prev => {
      const profile = prev[key]
      const lastPlayed = profile.lastPlayed
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      let streak = profile.streak
      if (lastPlayed === yesterday) {
        streak += 1
      } else if (lastPlayed !== today) {
        streak = 1
      }
      return {
        ...prev,
        [key]: { ...profile, lastPlayed: today, streak }
      }
    })
  }

  function addStars(count) {
    if (!activeProfile) return
    setProfiles(prev => ({
      ...prev,
      [activeProfile]: {
        ...prev[activeProfile],
        stars: prev[activeProfile].stars + count
      }
    }))
  }

  function addBadge(badge) {
    if (!activeProfile) return
    setProfiles(prev => ({
      ...prev,
      [activeProfile]: {
        ...prev[activeProfile],
        badges: [...prev[activeProfile].badges, { ...badge, date: new Date().toISOString() }]
      }
    }))
  }

  function updateProgress(subject, results) {
    if (!activeProfile) return
    setProfiles(prev => {
      const profile = prev[activeProfile]
      const current = profile.progress[subject]
      return {
        ...prev,
        [activeProfile]: {
          ...profile,
          progress: {
            ...profile.progress,
            [subject]: { ...current, ...results }
          }
        }
      }
    })
  }

  const currentProfile = activeProfile ? profiles[activeProfile] : null

  return (
    <ProfileContext.Provider value={{
      profiles,
      activeProfile,
      currentProfile,
      selectProfile,
      addStars,
      addBadge,
      updateProgress,
    }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider')
  return ctx
}
