/**
 * Optimized animation variants — shorter durations, smaller distances.
 * Heavy variants (heroTextReveal with skewY) kept but duration reduced.
 */

export const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
}

export const fadeInDown = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
}

export const fadeInLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

export const fadeInRight = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.93 },
  visible: {
    opacity: 1, scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
}

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
}

export const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
}

export const cardHover = {
  rest:  { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.2, ease: 'easeOut' } },
}

export const heroTextReveal = {
  hidden:  { opacity: 0, y: 40 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

export const pageTransition = {
  initial:    { opacity: 0 },
  animate:    { opacity: 1 },
  exit:       { opacity: 0 },
  transition: { duration: 0.25, ease: 'easeInOut' },
}

// Used by SectionWrapper (now CSS-based, kept for legacy imports)
export const scrollReveal = {
  hidden:  { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
}
