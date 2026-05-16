/**
 * ProfileContext — Single Firebase listener for profile data.
 * Prevents each component (Navbar, PageHero, Home, About, Contact...)
 * from spawning its own onSnapshot listener.
 */
import { createContext, useContext, useEffect, useState } from 'react'
import { db } from '../firebase/firebase'
import { doc, onSnapshot } from 'firebase/firestore'

const ProfileContext = createContext(null)

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const docRef = doc(db, 'settings', 'profile')
    const unsub = onSnapshot(
      docRef,
      (snap) => {
        setProfile(snap.exists() ? snap.data() : null)
        setLoading(false)
      },
      (err) => {
        console.error('Profile fetch error:', err)
        setLoading(false)
      }
    )
    return unsub
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
