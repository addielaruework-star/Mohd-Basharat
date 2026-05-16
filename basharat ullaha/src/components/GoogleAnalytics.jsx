import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * GoogleAnalytics — Lightweight route change tracker for GA4.
 * Excludes admin routes from analytics tracking to ensure clean data.
 */
const TRACKING_ID = 'G-61BGBH367H'

export default function GoogleAnalytics() {
  const location = useLocation()

  useEffect(() => {
    // Exclude admin routes
    if (location.pathname.startsWith('/admin')) return

    if (typeof window.gtag === 'function') {
      window.gtag('config', TRACKING_ID, {
        page_path: location.pathname + location.search,
        page_title: document.title,
      })
    }
  }, [location])

  return null
}
