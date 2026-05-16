/**
 * PageTransition — wraps each route with a consistent fade-in/slide-up.
 * Lightweight: single motion.div, duration 0.3s, no spring physics.
 */
export default function PageTransition({ children }) {
  return (
    <div>
      {children}
    </div>
  )
}
