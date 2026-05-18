import { useState, useEffect, useCallback, memo } from 'react'
import { ChevronUp } from 'lucide-react'

/**
 * ScrollToTopButton — Phase 9 Step 1
 * - Appears after 400px scroll on ALL public pages (injected in MainLayout)
 * - Passive scroll listener (Phase 6 compatible)
 * - CSS transition only — no Framer Motion overhead
 * - Fixed bottom-right, mobile-optimised, gold/navy design language
 */
const ScrollToTopButton = memo(function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  const handleScroll = useCallback(() => {
    setVisible(window.scrollY > 400)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      id="scroll-to-top-btn"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="scroll-top-btn"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.9)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <ChevronUp size={20} strokeWidth={2.5} />
    </button>
  )
})

export default ScrollToTopButton
