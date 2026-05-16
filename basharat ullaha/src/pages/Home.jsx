import { memo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import PageContainer from '../components/PageContainer'
import SectionWrapper from '../components/SectionWrapper'
import { fadeInLeft, fadeInRight } from '../animations/variants'
import { useProfile } from '../hooks/useFirebaseData'
import { useSiteAssets } from '../context/SiteAssetsContext'
import { useSEO } from '../lib/useSEO'
import { images } from '../data/imageImports'

const heroStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}
const heroItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}
const ruleAnim = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 } },
}

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

      {/* ── HERO ─────────────────────────────────────────────── */}
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
          <img
            src={heroImg}
            alt="Profile"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: 'center 35%' }}
            loading="lazy"
          />
          <div
            className="absolute inset-y-0 left-0 w-40"
            style={{ background: 'linear-gradient(to right, var(--navy), transparent)' }}
          />
        </div>

        {/* Left text content */}
        <motion.div
          variants={heroStagger}
          initial="hidden"
          animate="visible"
          className="relative z-10 container-custom"
        >
          <div style={{ maxWidth: 560, paddingTop: '6rem', paddingBottom: '6rem' }}>

            <motion.p variants={heroItem} className="eyebrow mb-5">
              Official Digital Portfolio
            </motion.p>

            <div style={{ overflow: 'hidden', marginBottom: '1.25rem' }}>
              <motion.h1
                variants={heroItem}
                className="font-display font-bold text-white"
                style={{ fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', lineHeight: 1.05, letterSpacing: '-0.02em' }}
              >
                {firstName}<br />{restName}
              </motion.h1>
            </div>

            <motion.div
              variants={ruleAnim}
              className="gold-rule mb-6"
              style={{ transformOrigin: 'left' }}
            />

            <motion.p
              variants={heroItem}
              style={{
                fontSize: '1.1rem',
                color: 'rgba(255,255,255,0.9)',
                lineHeight: 1.75,
                fontWeight: 400,
                marginBottom: '2.5rem',
                maxWidth: 480,
              }}
            >
              {profile?.heroSubtitle || 'Committed social activist and humanitarian leader dedicated to promoting human rights and social justice.'}
            </motion.p>

            <motion.div
              variants={heroItem}
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
            </motion.div>

            {/* Mobile profile image */}
            <div className="lg:hidden mt-10">
              <div className="media-container aspect-square max-w-sm mx-auto" style={{ border: '1px solid rgba(201,168,76,0.18)' }}>
                <img
                  src={mobileHeroImg}
                  alt="Profile"
                  className="img-cover"
                  style={{ objectPosition: 'center 35%' }}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Scroll hint */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
          style={{ opacity: 0.6 }}
        >
          <div style={{ width: 1, height: 36, background: 'linear-gradient(to bottom, var(--gold), transparent)' }} />
        </div>
      </section>

      {/* ── ABOUT SPLIT ──────────────────────────────────────── */}
      <SectionWrapper>
        <div className="container-custom">
          <div className="split-section">
            <motion.div
              variants={fadeInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
            >
              <div className="media-container aspect-[3/4]" style={{ border: '1px solid rgba(201,168,76,0.15)' }}>
                <img
                  src={assets.biographyImage || images.gallery.publicEvents[0]}
                  alt="Event Photo"
                  className="img-cover"
                  style={{ objectPosition: 'center 35%' }}
                  loading="lazy"
                />
              </div>
            </motion.div>

            <motion.div
              variants={fadeInRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
            >
              <p className="eyebrow mb-4">About</p>
              <h2 className="section-title mb-4" style={{ maxWidth: 400 }}>
                A Life Devoted to People
              </h2>
              <div className="gold-rule mb-6" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ fontSize: '0.95rem', color: 'var(--gray-mid)', lineHeight: 1.8 }}>
                  {profile?.name || 'Mohd Basharath Ullah'} is a committed social activist and humanitarian leader dedicated to promoting human rights and social justice.
                </p>
                <p style={{ fontSize: '0.95rem', color: 'var(--gray-mid)', lineHeight: 1.8 }}>
                  With experience across national and international platforms, he has consistently worked toward the welfare of underprivileged communities.
                </p>
              </div>
              <div style={{ marginTop: '2rem' }}>
                <Link to="/about" className="btn-primary">
                  Full Biography <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </SectionWrapper>

      {/* ── ROLES / WORK ─────────────────────────────────────── */}
      <div style={{ background: 'var(--cream)', padding: 'var(--sp-xl) 0' }}>
        <div className="container-custom">
          <div className="split-section" style={{ alignItems: 'flex-start' }}>
            <motion.div
              variants={fadeInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
            >
              <p className="eyebrow mb-3">Leadership &amp; Service</p>
              <h2 className="section-title mb-6">Positions Held</h2>
              <div className="gold-rule mb-8" />

              <ul className="list-none space-y-6">
                <li style={{ borderLeft: '2px solid var(--gold)', paddingLeft: '1.25rem' }}>
                  <h3 className="font-display font-bold" style={{ fontSize: '1.1rem', color: 'var(--navy)' }}>Ex Vice President</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--gray-mid)' }}>International Human Rights &amp; Social Justice Organization</p>
                </li>
                <li style={{ borderLeft: '2px solid var(--gold)', paddingLeft: '1.25rem' }}>
                  <h3 className="font-display font-bold" style={{ fontSize: '1.1rem', color: 'var(--navy)' }}>Director</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--gray-mid)' }}>Anti-Corruption Foundation of India</p>
                </li>
              </ul>

              <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--gray-mid)', lineHeight: 1.7, maxWidth: 400 }}>
                Worked with multiple national and international organizations on social impact initiatives.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
            >
              <div className="media-container aspect-[4/3]" style={{ border: '1px solid rgba(201,168,76,0.15)' }}>
                <img
                  src={assets.aboutBanner || images.gallery.meetings[0]}
                  alt="Leadership Photo"
                  className="img-cover"
                  style={{ objectPosition: 'center 35%' }}
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── MISSION QUOTE ─────────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{ background: 'var(--navy)', padding: 'var(--sp-xl) 0' }}
      >
        <div
          className="absolute inset-0 opacity-4"
          style={{ backgroundImage: 'repeating-linear-gradient(-60deg, rgba(201,168,76,0.1) 0px, rgba(201,168,76,0.1) 1px, transparent 1px, transparent 48px)' }}
        />
        <div className="container-custom relative z-10 text-center" style={{ maxWidth: 720 }}>
          <p className="eyebrow mb-5">Mission</p>
          <blockquote
            className="font-display text-white"
            style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)', lineHeight: 1.45, fontWeight: 600, fontStyle: 'italic' }}
          >
            "To serve humanity by promoting justice, equality, and support for underprivileged communities."
          </blockquote>
          <div className="gold-rule mx-auto mt-7 mb-8" />
          <Link to="/social-services" className="btn-primary">
            View Social Work <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* ── FULL-WIDTH GALLERY BANNER ──────────────────────────── */}
      <div className="relative overflow-hidden section-banner-height">
        <img
          src={galleryBannerImg}
          alt="Visual Chronicle"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center 30%' }}
          loading="lazy"
        />
        <div className="overlay-premium flex items-end">
          <div className="container-custom pb-10">
            <p className="eyebrow mb-2">Gallery</p>
            <h3 className="font-display font-bold text-white mb-4" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>
              {profile?.galleryBannerTitle || 'Visual Chronicle of Service'}
            </h3>
            <Link to="/gallery" className="btn-ghost">
              View Full Gallery <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

    </PageContainer>
  )
})

export default Home
