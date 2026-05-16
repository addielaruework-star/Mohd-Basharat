/**
 * useSiteAssets — shared singleton hook for settings/siteAssets document.
 * Uses a real-time onSnapshot listener so every admin upload reflects instantly
 * across all open browser tabs without a page reload.
 */
import { createContext, useContext, useEffect, useState } from 'react'
import { db } from '../firebase/firebase'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'

/** Default fallback structure — matches what the pages already hard-code */
export const DEFAULT_ASSETS = {
  heroImage: '',
  mobileHeroImage: '',
  aboutBanner: '',
  biographyImage: '',
  awardsBanner: '',
  servicesBanner: '',
  galleryBanner: '',
  achievementsBanner: '',
  contactBanner: '',
  profileImage: '',
}

const SiteAssetsContext = createContext({ assets: DEFAULT_ASSETS, loading: true })

export function SiteAssetsProvider({ children }) {
  const [assets, setAssets] = useState(DEFAULT_ASSETS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ref = doc(db, 'settings', 'siteAssets')
    const unsub = onSnapshot(
      ref,
      (snap) => {
        setAssets(snap.exists() ? { ...DEFAULT_ASSETS, ...snap.data() } : DEFAULT_ASSETS)
        setLoading(false)
      },
      (err) => {
        console.error('siteAssets fetch error:', err)
        setLoading(false)
      }
    )
    return unsub
  }, [])

  return (
    <SiteAssetsContext.Provider value={{ assets, loading }}>
      {children}
    </SiteAssetsContext.Provider>
  )
}

export function useSiteAssets() {
  return useContext(SiteAssetsContext)
}

/** Persist a partial update to settings/siteAssets */
export async function saveSiteAssets(partial) {
  const ref = doc(db, 'settings', 'siteAssets')
  await setDoc(ref, partial, { merge: true })
}
