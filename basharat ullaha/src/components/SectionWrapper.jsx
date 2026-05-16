/**
 * SectionWrapper — Lightweight scroll reveal using CSS transitions.
 * Replaced Framer Motion's useInView + motion.div with a native
 * IntersectionObserver + CSS opacity/transform for far lower CPU cost.
 */
import { memo } from 'react'

const SectionWrapper = memo(function SectionWrapper({
  children,
  id,
  className = '',
  bgClass = '',
  noPad = false,
  bg,
}) {
  return (
    <section
      id={id}
      className={`${noPad ? '' : 'section-padding'} ${bgClass} ${className}`}
      style={bg ? { background: bg } : undefined}
    >
      {children}
    </section>
  )
})

export default SectionWrapper
