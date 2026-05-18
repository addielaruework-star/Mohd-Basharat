import { useState, useEffect, useCallback, memo } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { m, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { profileData } from '../data/profileData'
import { useProfile } from '../hooks/useFirebaseData'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/milestone', label: 'Milestone' },       // Phase 9 — merged section
  { to: '/media-coverage', label: 'Media' },      // Phase 9 Step 3
  { to: '/social-services', label: 'Services' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/connections', label: 'Connections' },
  { to: '/contact', label: 'Contact' },
]

const mobileMenuVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
}

const Navbar = memo(function Navbar() {
  const { profile } = useProfile()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  const name = profile?.name || profileData.name

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 50)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const solid = scrolled || !isHome
  const bg = solid ? 'rgba(255,255,255,0.95)' : 'transparent'
  const shadow = solid ? '0 2px 12px rgba(11,29,53,0.08)' : 'none'
  const logoColor = solid ? 'var(--navy)' : '#fff'
  const linkColor = solid ? 'var(--navy)' : 'rgba(255,255,255,0.88)'

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 touch-none lg:touch-auto"
        style={{
          height: 72,
          background: bg,
          boxShadow: shadow,
          // Expensive blur reduced for mobile performance
          backdropFilter: solid ? 'blur(10px)' : 'none',
          WebkitBackdropFilter: solid ? 'blur(10px)' : 'none',
          transition: 'background 0.25s, box-shadow 0.25s, backdrop-filter 0.25s',
        }}
      >
        <div className="container-custom h-full flex items-center justify-between">

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <p className="eyebrow mb-0.5" style={{ letterSpacing: '0.22em', color: 'var(--gold)' }}>
              Official Portfolio
            </p>
            <p
              className="font-display font-bold leading-none"
              style={{ fontSize: '1.05rem', color: logoColor, transition: 'color 0.25s' }}
            >
              {name}
            </p>
          </Link>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-0.5 list-none">
            {navLinks.map(link => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  style={({ isActive }) => ({
                    display: 'block',
                    padding: '0.5rem 1rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    textDecoration: 'none',
                    color: isActive ? 'var(--gold)' : linkColor,
                    transition: 'color 0.2s',
                    position: 'relative',
                  })}
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      {isActive && (
                        <m.span
                          layoutId="nav-indicator"
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: '0.85rem',
                            right: '0.85rem',
                            height: 1.5,
                            borderRadius: 1,
                            background: 'var(--gold)',
                          }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="lg:hidden"
            style={{ color: linkColor, background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <m.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-[68px] left-0 right-0 z-40"
            style={{ background: 'var(--navy)', borderBottom: '1px solid rgba(201,168,76,0.15)' }}
          >
            <div className="container-custom py-5">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.8rem 0',
                    fontSize: '0.95rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--gold)' : 'rgba(255,255,255,0.85)',
                    textDecoration: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                  })}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {!isHome && <div style={{ height: 72 }} />}
    </>
  )
})

export default Navbar
