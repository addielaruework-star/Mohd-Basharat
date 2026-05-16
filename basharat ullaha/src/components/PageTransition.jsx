/**
 * PageTransition — wraps each route with a consistent fade-in/slide-up.
 * Lightweight: single motion.div, duration 0.3s, no spring physics.
 */
import { motion } from 'framer-motion'

const variants = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -6 },
}

export default function PageTransition({ children }) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
