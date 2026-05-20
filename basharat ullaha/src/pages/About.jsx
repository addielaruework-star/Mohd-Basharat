import { memo, useMemo } from 'react'
import { Target, Eye } from 'lucide-react'
import PageContainer from '../components/PageContainer'
import PageHero from '../components/PageHero'
import SectionWrapper from '../components/SectionWrapper'
import SectionTitle from '../components/SectionTitle'
import { useProfile } from '../hooks/useFirebaseData'
import { useSiteAssets } from '../context/SiteAssetsContext'
import { useSEO } from '../lib/useSEO'
import { images } from '../data/imageImports'
import { optimizeCloudinaryUrl } from '../utils/optimizeCloudinaryUrl'
import LazyImage from '../components/LazyImage'
import { parseRichText } from '../utils/richText'

const About = memo(function About() {
  const { profile, loading } = useProfile()
  const { assets } = useSiteAssets()

  useSEO({
    title: 'About',
    description: 'Learn about Mohd Basharath Ullah — a committed social activist and humanitarian leader dedicated to promoting human rights and social justice.',
    canonical: '/about',
  })

  const name = profile?.name || 'Mohd Basharath Ullah'
  const profileImg   = assets.profileImage   || images.profile.main
  const aboutBannerImg = assets.aboutBanner  || images.gallery.communityService[1]

  const leadershipPositions = useMemo(() => {
    return profile?.leadershipPositions || [
      { organization: 'Anti Corruption Foundation of India', title: 'State Chief Director Telangana' },
      { organization: 'International Human Rights & Social Justice Organization', title: 'Ex Vice President' }
    ]
  }, [profile?.leadershipPositions])

  const missionVision = useMemo(() => [
    {
      icon: Target,
      label: 'Mission',
      heading: 'Our Purpose',
      body: profile?.mission || 'To serve humanity by promoting justice, equality, and support for underprivileged communities.',
    },
    {
      icon: Eye,
      label: 'Vision',
      heading: 'Our Future',
      body: profile?.vision || 'To build a society where every individual has equal rights, dignity, and opportunities.',
    },
  ], [profile?.mission, profile?.vision])

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

  return (
    <PageContainer>
      <PageHero
        title="About"
        subtitle="A committed social activist and humanitarian leader."
      />

      {/* ── Biography split ─────────────────────────── */}
      <SectionWrapper>
        <div className="container-custom">
          <div className="split-section">
            <div>
              <div className="media-container aspect-[3/4]" style={{ border: '1px solid rgba(201,168,76,0.14)' }}>
                <LazyImage
                  src={optimizeCloudinaryUrl(profileImg)}
                  alt="Profile"
                  className="w-full h-full"
                  style={{ objectPosition: 'center 25%' }}
                />
              </div>
            </div>

            <div>
              <p className="eyebrow mb-4">Biography</p>
              <h2 className="section-title mb-4" style={{ maxWidth: 380 }}>{name}</h2>
              <div className="gold-rule mb-7" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ fontSize: '0.95rem', color: 'var(--gray-mid)', lineHeight: 1.85 }}>
                  {parseRichText(profile?.aboutText || `${name} is a committed social activist and humanitarian leader dedicated to promoting human rights and social justice.`)}
                </p>
              </div>

              <div style={{ marginTop: '2.5rem' }}>
                <p className="eyebrow mb-3">Leadership Positions</p>
                <ul className="list-none space-y-4">
                  {leadershipPositions.map((pos, i) => (
                    <li key={i} style={{ borderLeft: '1px solid var(--gold)', paddingLeft: '1rem' }}>
                      <h3 className="font-display font-semibold" style={{ fontSize: '1rem', color: 'var(--navy)' }}>{parseRichText(pos.organization)}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--gray-mid)' }}>{parseRichText(pos.title)}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* ── Mission & Vision ────────────────────────── */}
      <div style={{ background: 'var(--cream)', padding: 'var(--sp-xl) 0' }}>
        <div className="container-custom">
          <SectionTitle label="Purpose" title="Mission & Vision" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {missionVision.map(item => (
              <div
                key={item.label}
                className="card card-hover-effect"
                style={{
                  padding: '2.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 8, flexShrink: 0,
                    background: 'var(--navy)', color: 'var(--gold)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="eyebrow" style={{ marginBottom: 2 }}>{item.label}</p>
                    <h3 className="font-display font-bold" style={{ fontSize: '1.1rem', color: 'var(--navy)' }}>{item.heading}</h3>
                  </div>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--gray-mid)', lineHeight: 1.8 }}>{parseRichText(item.body)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Visual Break */}
      <div className="relative overflow-hidden section-banner-height">
        <LazyImage
          src={optimizeCloudinaryUrl(aboutBannerImg)}
          alt="Community Service"
          className="absolute inset-0 w-full h-full"
          style={{ objectPosition: 'center center' }}
        />
        <div className="overlay-premium" />
      </div>

    </PageContainer>
  )
})

export default About
