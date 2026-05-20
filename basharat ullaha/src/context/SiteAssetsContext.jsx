/**
 * SiteAssetsContext — Optimized shared hook for site assets.
 * Uses sessionStorage caching for faster perceived performance.
 * Switched from real-time onSnapshot to getDoc to minimize background listeners.
 */
import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { db } from '../lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

/** Default fallback structure — matches what the pages already hard-code */
export const DEFAULT_ASSETS = {
  // Section Images
  leadershipImage: '',
  profileImage: '', // Biography Portrait
  mobileHeroImage: '',
  contactIllustration: '',

  // Page Banners
  heroImage: '', // Home Banner
  aboutBanner: '',
  awardsBanner: '', // Milestone Banner
  servicesBanner: '',
  galleryBanner: '',
  mediaBanner: '',
  contactBanner: '',
}

const SiteAssetsContext = createContext({ assets: DEFAULT_ASSETS, loading: true })
const CACHE_KEY = 'mb_assets_cache'

export function SiteAssetsProvider({ children }) {
  const [assets, setAssets] = useState(() => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY)
      return cached ? JSON.parse(cached) : DEFAULT_ASSETS
    } catch {
      return DEFAULT_ASSETS
    }
  })
  const [loading, setLoading] = useState(assets === DEFAULT_ASSETS)

  useEffect(() => {
    const ref = doc(db, 'settings', 'siteAssets')
    
    const fetchAssets = async () => {
      try {
        const snap = await getDoc(ref)
        if (snap.exists()) {
          const data = { ...DEFAULT_ASSETS, ...snap.data() }
          setAssets(data)
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(data))
        }
      } catch (err) {
        console.error('siteAssets fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAssets()
  }, [])

  const value = useMemo(() => ({ assets, loading }), [assets, loading])

  return (
    <SiteAssetsContext.Provider value={value}>
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
