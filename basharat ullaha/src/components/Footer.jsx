import { Link } from 'react-router-dom'
import { Phone, Mail } from 'lucide-react'
import { profileData } from '../data/profileData'
import { useProfile } from '../hooks/useFirebaseData'

// Official Instagram SVG
const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
)

// Official Facebook SVG
const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

export default function Footer() {
  const { profile } = useProfile()
  
  const name = profile?.name || profileData.name
  const phone = profile?.phone || profileData.phone
  const email = profile?.email || profileData.email
  const instagram = profile?.instagram || profileData.instagram
  const facebook = profile?.facebook || profileData.facebook

  return (
    <footer style={{ background: 'var(--navy)' }}>
      {/* Gold top line */}
      <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, var(--gold-dark), transparent)' }} />

      <div className="container-custom" style={{ paddingTop: '5rem', paddingBottom: '3rem' }}>
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand & Social Column */}
          <div className="lg:col-span-5 pr-0 lg:pr-10">
            <p className="eyebrow mb-3" style={{ color: 'var(--gold-light)' }}>Official Digital Portfolio</p>
            <h3 className="font-display font-bold text-white mb-4" style={{ fontSize: '1.4rem', letterSpacing: '0.02em' }}>
              {name}
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, maxWidth: 360 }}>
              {profile?.heroSubtitle || 'Committed social activist and humanitarian leader dedicated to promoting human rights, equality, and social justice.'}
            </p>
            
            {/* Social Icons List */}
            <div className="flex flex-row flex-wrap gap-4 mt-8">
              <SIcon href={instagram} label="Instagram">
                <InstagramIcon />
              </SIcon>
              <SIcon href={facebook} label="Facebook">
                <FacebookIcon />
              </SIcon>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6 mt-4 lg:mt-0">
            
            <LinkGroup title="Pages" links={[
              { to: '/about', label: 'Biography' },
              { to: '/milestone', label: 'Milestone' },
              { to: '/social-services', label: 'Social Services' },
              { to: '/gallery', label: 'Gallery' },
            ]} />
            
            <LinkGroup title="Resources" links={[
              { to: '/milestone?tab=awards', label: 'Awards' },
              { to: '/milestone?tab=certificates', label: 'Certificates' },
              { to: '/connections', label: 'Connections' },
              { to: '/contact', label: 'Contact' },
            ]} />

            {/* Direct Contact */}
            <div>
              <p className="eyebrow mb-6" style={{ color: 'var(--gold-light)' }}>Get in Touch</p>
              <div className="flex flex-col gap-5">
                <CLink href={`tel:${phone}`} icon={<Phone size={16} />} label={phone} />
                <CLink href={`mailto:${email}`} icon={<Mail size={16} />} label={email} />
              </div>
            </div>

          </div>

        </div>

        {/* Bottom copyright rule */}
        <div 
          className="flex flex-col md:flex-row items-center justify-between mt-16 pt-8 gap-4" 
          style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
        >
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.03em' }}>
            © {new Date().getFullYear()} {name}.
          </p>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.03em' }}>
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

function LinkGroup({ title, links }) {
  return (
    <div>
      <p className="eyebrow mb-6" style={{ color: 'var(--gold-light)' }}>{title}</p>
      <ul className="list-none space-y-4">
        {links.map(l => (
          <li key={l.to}>
            <Link
              to={l.to}
              style={{ 
                fontSize: '0.95rem', 
                color: 'rgba(255,255,255,0.75)', 
                textDecoration: 'none', 
                transition: 'color 0.2s, transform 0.2s',
                display: 'inline-block'
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--gold)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; e.currentTarget.style.transform = 'translateX(0)'; }}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CLink({ href, icon, label }) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel="noopener noreferrer"
      style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none' }}
      onMouseEnter={e => {
        e.currentTarget.style.color = 'var(--gold)';
        e.currentTarget.querySelector('.icon-bg').style.background = 'var(--gold)';
        e.currentTarget.querySelector('.icon-bg').style.color = 'var(--navy)';
        e.currentTarget.querySelector('.icon-bg').style.transform = 'scale(1.1)';
        e.currentTarget.querySelector('.c-label').style.color = 'var(--gold)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = 'rgba(255,255,255,0.75)';
        e.currentTarget.querySelector('.icon-bg').style.background = 'rgba(255,255,255,0.05)';
        e.currentTarget.querySelector('.icon-bg').style.color = 'var(--gold)';
        e.currentTarget.querySelector('.icon-bg').style.transform = 'scale(1)';
        e.currentTarget.querySelector('.c-label').style.color = 'rgba(255,255,255,0.85)';
      }}
    >
      <div 
        className="icon-bg"
        style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          width: 40, height: 40, borderRadius: '50%', 
          background: 'rgba(255,255,255,0.05)', color: 'var(--gold)',
          transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
          flexShrink: 0
        }}
      >
        {icon}
      </div>
      <span className="c-label" style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)', wordBreak: 'break-all', transition: 'color 0.2s' }}>
        {label}
      </span>
    </a>
  )
}

function SIcon({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        textDecoration: 'none', width: 'fit-content'
      }}
      onMouseEnter={e => {
        e.currentTarget.querySelector('.icon-bg').style.borderColor = 'var(--gold)';
        e.currentTarget.querySelector('.icon-bg').style.color = 'var(--navy)';
        e.currentTarget.querySelector('.icon-bg').style.background = 'var(--gold)';
        e.currentTarget.querySelector('.icon-bg').style.transform = 'scale(1.1)';
        e.currentTarget.querySelector('.icon-bg').style.boxShadow = '0 4px 14px rgba(201,168,76,0.4)';
      }}
      onMouseLeave={e => {
        e.currentTarget.querySelector('.icon-bg').style.borderColor = 'rgba(255,255,255,0.2)';
        e.currentTarget.querySelector('.icon-bg').style.color = '#fff';
        e.currentTarget.querySelector('.icon-bg').style.background = 'rgba(255,255,255,0.05)';
        e.currentTarget.querySelector('.icon-bg').style.transform = 'scale(1)';
        e.currentTarget.querySelector('.icon-bg').style.boxShadow = 'none';
      }}
    >
      <div
        className="icon-bg"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 40, height: 40, borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff',
          transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
          flexShrink: 0
        }}
      >
        {children}
      </div>
    </a>
  )
}
