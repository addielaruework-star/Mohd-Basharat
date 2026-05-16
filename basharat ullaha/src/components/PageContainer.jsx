import { m } from 'framer-motion'
import { pageTransition } from '../animations/variants'

export default function PageContainer({ children, className = '' }) {
  return (
    <m.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
      transition={pageTransition.transition}
      className={`page-transition ${className}`}
    >
      {children}
    </m.div>
  )
}
