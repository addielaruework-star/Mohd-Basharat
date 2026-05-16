/**
 * PageHero — Clean inner-page hero banner (memoized)
 */
import { memo } from 'react'
import { profileData } from '../data/profileData'
import { useProfile } from '../hooks/useFirebaseData'

const PageHero = memo(function PageHero({ title, subtitle }) {
  const { profile } = useProfile()
  const name = profile?.name || profileData.name

  return (
    <div
      className="relative flex items-center overflow-hidden"
      style={{
        minHeight: 240,
        background: 'linear-gradient(130deg, var(--navy) 0%, var(--navy-light) 100%)',
      }}
    >
      {/* Subtle diagonal lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(60deg, rgba(201,168,76,0.04) 0px, rgba(201,168,76,0.04) 1px, transparent 1px, transparent 40px)',
        }}
      />

      <div className="container-custom relative z-10" style={{ padding: '4rem 2rem' }}>
        <p className="eyebrow mb-3" style={{ color: 'var(--gold)' }}>{name}</p>
        <h1
          className="font-display font-bold text-white"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', lineHeight: 1.1, marginBottom: '0.75rem' }}
        >
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.9)', maxWidth: 540, lineHeight: 1.7 }}>
            {subtitle}
          </p>
        )}
        <div className="gold-rule mt-5" />
      </div>
    </div>
  )
})

export default PageHero
