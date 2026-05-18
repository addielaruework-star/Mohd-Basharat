import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageTransition from '../components/PageTransition'
import ScrollToTopButton from '../components/ScrollToTopButton'

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--off-white)' }}>
      <Navbar />
      <main className="flex-1">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
      {/* Phase 9 — Global scroll-to-top (z-40 keeps it below Navbar z-50 / admin z-50) */}
      <ScrollToTopButton />
    </div>
  )
}
