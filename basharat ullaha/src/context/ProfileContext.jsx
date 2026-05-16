/**
 * ProfileContext — Optimized Firebase data provider.
 * Uses sessionStorage caching to ensure instant interactive state on reload.
 * Switched from real-time onSnapshot to getDoc to reduce background overhead.
 */
import { createContext, useContext, useEffect, useState } from 'react'
import { db } from '../lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

const ProfileContext = createContext(null)

const CACHE_KEY = 'mb_profile_cache'

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY)
      return cached ? JSON.parse(cached) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(!profile)

  useEffect(() => {
    const docRef = doc(db, 'settings', 'profile')
    
    const fetchProfile = async () => {
      try {
        const snap = await getDoc(docRef)
        if (snap.exists()) {
          const data = snap.data()
          setProfile(data)
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(data))
        }
      } catch (err) {
        console.error('Profile fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  return (
    <ProfileContext.Provider value={{ profile, loading }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfileCtx() {
  return useContext(ProfileContext)
}
