import { memo, lazy } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import PageContainer from '../components/PageContainer'
import { useProfile } from '../hooks/useFirebaseData'
import { useSiteAssets } from '../context/SiteAssetsContext'
import { useSEO } from '../lib/useSEO'
import { images } from '../data/imageImports'
import { optimizeCloudinaryUrl } from '../utils/optimizeCloudinaryUrl'
import LazyImage from '../components/LazyImage'
import DeferredSection from '../components/DeferredSection'
import { SkeletonSimple } from '../components/SkeletonLoaders'

// Lazy loaded sections
const AboutSection = lazy(() => import('./home/AboutSection'))
const RolesSection = lazy(() => import('./home/RolesSection'))
const MissionSection = lazy(() => import('./home/MissionSection'))
const GalleryBannerSection = lazy(() => import('./home/GalleryBannerSection'))

const Home = memo(function Home() {
  const { profile, loading } = useProfile()
  const { assets } = useSiteAssets()

  useSEO({
    title: 'Official Portfolio',
    description: 'Official digital portfolio of Mohd Basharath Ullah — Social Activist and Humanitarian Leader dedicated to Justice, Equality and Public Welfare.',
    canonical: '/',
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--navy)' }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.15)',
          borderTopColor: 'var(--gold)',
          animation: 'spin 0.7s linear infinite',
        }} />
      </div>
    )
  }

  const nameParts = (profile?.name || 'Mohd Basharath Ullah').split(' ')
  const firstName = nameParts[0]
  const restName = nameParts.slice(1).join(' ')

  // CMS-first image resolution
  const heroImg       = assets.heroImage       || images.profile.main
  const mobileHeroImg = assets.mobileHeroImage || assets.profileImage || images.profile.main
  const galleryBannerImg = assets.galleryBanner || images.gallery.publicEvents[2]

  return (
    <PageContainer>

      {/* ── HERO (Critical Path) ─────────────────────────── */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ background: 'var(--navy)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(ellipse 70% 55% at 60% 45%, rgba(30,58,95,0.6) 0%, transparent 75%)',
          }}
        />

        {/* Right half: large profile image area */}
        <div
          className="absolute right-0 top-0 bottom-0 hidden lg:block"
          style={{ width: '48%' }}
        >
          <LazyImage
            src={optimizeCloudinaryUrl(heroImg)}
            alt="Profile"
            className="absolute inset-0 w-full h-full"
            style={{ objectPosition: 'center 35%' }}
            isHero={true}
          />
          <div
            className="absolute inset-y-0 left-0 w-40"
            style={{ background: 'linear-gradient(to right, var(--navy), transparent)' }}
          />
        </div>

        {/* Left text content */}
        <div className="relative z-10 container-custom">

          <div style={{ maxWidth: 560, paddingTop: '6rem', paddingBottom: '6rem' }}>

            <p className="eyebrow mb-5">
              Official Digital Portfolio
            </p>

            <div style={{ overflow: 'hidden', marginBottom: '1.25rem' }}>
              <h1
                className="font-display font-bold text-white"
                style={{ fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', lineHeight: 1.05, letterSpacing: '-0.02em' }}
              >
                {firstName}<br />{restName}
              </h1>
            </div>

            <div
              className="gold-rule mb-6"
              style={{ transformOrigin: 'left' }}
            />

            <p
              style={{
                fontSize: '1.1rem',
                color: 'rgba(255,255,255,0.9)',
                lineHeight: 1.75,
                fontWeight: 400,
                marginBottom: '2.5rem',
                maxWidth: 480,
                whiteSpace: 'pre-line',
              }}
            >
              {profile?.heroSubtitle || 'Committed social activist and humanitarian leader dedicated to promoting human rights and social justice.'}
            </p>

            <div
              className="flex items-center gap-6 flex-wrap mt-2"
            >
              <Link to="/about" className="btn-primary">
                Explore Profile <ArrowRight size={14} />
              </Link>
              <Link
                to="/contact"
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.85)',
                  textDecoration: 'none',
                  letterSpacing: '0.04em',
                  borderBottom: '1px solid rgba(255,255,255,0.4)',
                  paddingBottom: 2,
                  transition: 'color 0.2s, border-color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--gold)'; e.currentTarget.style.borderColor = 'var(--gold)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}
              >
                Get in Touch
              </Link>
            </div>

            {/* Mobile profile image */}
            <div className="lg:hidden mt-10">
              <div className="media-container aspect-square max-w-sm mx-auto" style={{ border: '1px solid rgba(201,168,76,0.18)' }}>
                <LazyImage
                  src={optimizeCloudinaryUrl(mobileHeroImg)}
                  alt="Profile"
                  className="w-full h-full"
                  style={{ objectPosition: 'center 35%' }}
                  isHero={true}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
          style={{ opacity: 0.6 }}
        >
          <div style={{ width: 1, height: 36, background: 'linear-gradient(to bottom, var(--gold), transparent)' }} />
        </div>
      </section>

      {/* ── DEFERRED SECTIONS (Below Fold) ────────────────── */}

      <DeferredSection minHeight="500px" fallback={<SkeletonSimple height="500px" className="my-10" />}>
        <AboutSection profile={profile} assets={assets} />
      </DeferredSection>

      <DeferredSection minHeight="400px" fallback={<SkeletonSimple height="400px" className="my-10" />}>
        <RolesSection assets={assets} />
      </DeferredSection>

      <DeferredSection minHeight="300px" fallback={<SkeletonSimple height="300px" className="my-10" />}>
        <MissionSection />
      </DeferredSection>

      <DeferredSection minHeight="400px" fallback={<SkeletonSimple height="400px" />}>
        <GalleryBannerSection profile={profile} galleryBannerImg={galleryBannerImg} />
      </DeferredSection>

    </PageContainer>
  )
})

export default Home
