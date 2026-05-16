/**
 * SectionWrapper — Lightweight scroll reveal using CSS transitions.
 * Replaced Framer Motion's useInView + motion.div with a native
 * IntersectionObserver + CSS opacity/transform for far lower CPU cost.
 */
import { useRef, useEffect, useState, memo } from 'react'

const SectionWrapper = memo(function SectionWrapper({
  children,
  id,
  className = '',
  bgClass = '',
  noPad = false,
  bg,
}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect() // once only
        }
      },
      { rootMargin: '-60px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id={id}
      ref={ref}
      className={`${noPad ? '' : 'section-padding'} ${bgClass} ${className}`}
      style={bg ? { background: bg } : undefined}
    >
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'none' : 'translateY(20px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          willChange: 'opacity, transform',
        }}
      >
        {children}
      </div>
    </section>
  )
})

export default SectionWrapper
