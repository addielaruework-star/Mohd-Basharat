/**
 * useFirebaseData — Optimized Firebase data hooks.
 *
 * useProfile()     → delegates to global ProfileContext (single listener)
 * useCollection()  → one-time getDocs fetch (no realtime listener overhead)
 *                    re-fetches only when collectionName changes
 */
import { useState, useEffect } from 'react'
import { db } from '../firebase/firebase'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { useProfileCtx } from '../context/ProfileContext'

// Re-export profile hook — backed by shared context, zero extra listeners
export function useProfile() {
  return useProfileCtx()
}

// One-time fetch per collection — much cheaper than a live onSnapshot
export function useCollection(collectionName) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    const q = query(collection(db, collectionName))
    getDocs(q)
      .then((snapshot) => {
        if (!cancelled) {
          setItems(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error(`Failed to fetch ${collectionName}:`, err)
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [collectionName])

  return { items, loading }
}
