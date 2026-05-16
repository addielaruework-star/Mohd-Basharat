import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * MicrosoftClarity — Handles session tracking for Microsoft Clarity.
 * Ensures that admin routes are excluded from recordings to protect sensitive data.
 */
export default function MicrosoftClarity() {
  const location = useLocation()

  useEffect(() => {
    // If we transition to an admin route, stop Clarity tracking for the session
    if (location.pathname.startsWith('/admin')) {
      if (typeof window.clarity === 'function') {
        // Stop recording to protect administrative privacy
        window.clarity('stop')
      }
    }
  }, [location])

  return null
}
