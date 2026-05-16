import { useState, useEffect, useRef, Suspense } from 'react'

/**
 * DeferredSection — lazy renders its children ONLY when it enters the viewport.
 * Reduces initial DOM size and improves first paint performance.
 */
export default function DeferredSection({ children, fallback, minHeight = '300px', offset = '200px' }) {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || isInView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: offset } // Start loading slightly before it enters viewport
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [isInView, offset])

  return (
    <div ref={ref} style={{ minHeight: isInView ? 'auto' : minHeight }}>
      {isInView ? (
        <Suspense fallback={fallback || null}>
          {children}
        </Suspense>
      ) : (
        fallback || null
      )}
    </div>
  )
}
