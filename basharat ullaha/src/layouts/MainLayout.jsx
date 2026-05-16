import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { AnimatePresence } from 'framer-motion'
import PageTransition from '../components/PageTransition'

export default function MainLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--off-white)' }}>
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}
