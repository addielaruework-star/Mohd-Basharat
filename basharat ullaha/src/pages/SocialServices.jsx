import { memo, useMemo } from 'react'
import { Heart, Scale, Users, Megaphone, Box, Shield, Link as LinkIcon } from 'lucide-react'
import PageContainer from '../components/PageContainer'
import PageHero from '../components/PageHero'
import SectionWrapper from '../components/SectionWrapper'
import SectionTitle from '../components/SectionTitle'
import { useProfile, useCollection } from '../hooks/useFirebaseData'
import { useSiteAssets } from '../context/SiteAssetsContext'
import { useSEO } from '../lib/useSEO'
import { images } from '../data/imageImports'
import { optimizeCloudinaryUrl } from '../utils/optimizeCloudinaryUrl'
import LazyImage from '../components/LazyImage'

const iconMap = { Scale, Shield, Users, Megaphone, Box, Heart, LinkIcon }

const services = [
  { icon: Scale,     title: 'Human Rights Advocacy' },
  { icon: Shield,    title: 'Social Justice Initiatives' },
  { icon: Users,     title: 'Community Development Programs' },
  { icon: Megaphone, title: 'Awareness Campaigns' },
  { icon: Box,       title: 'Relief Activities' },
  { icon: Heart,     title: 'Support for Economically Weaker Sections' },
  { icon: LinkIcon,  title: 'NGO Collaborations for Social Welfare Initiatives' }
]

const SocialServices = memo(function SocialServices() {
  const { profile, loading: profileLoading } = useProfile()
  const { items: fetchedServices, loading: servicesLoading } = useCollection('services')
  const { assets } = useSiteAssets()

  const loading = profileLoading || servicesLoading
  const bannerImg = assets.servicesBanner || images.gallery.communityService[1]

  const displayServices = useMemo(() => {
    return fetchedServices && fetchedServices.length > 0 ? fetchedServices : services
  }, [fetchedServices])

  useSEO({
    title: 'Social Services',
    description: 'Grassroots social service initiatives by Mohd Basharath Ullah — human rights advocacy, community development, awareness campaigns and NGO collaborations.',
    canonical: '/social-services',
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

  const name = profile?.name || 'Mohd Basharath Ullah'

  return (
    <PageContainer>
      <PageHero
        title="Social Services"
        subtitle="Grassroots initiatives focused on creating meaningful social impact."
      />

      {/* Split intro */}
      <SectionWrapper>
        <div className="container-custom">
          <div className="split-section">
            <div>
              <div className="media-container aspect-[4/3]" style={{ border: '1px solid rgba(201,168,76,0.14)' }}>
                <LazyImage
                  src={optimizeCloudinaryUrl(assets.biographyImage || images.gallery.communityService[0])}
                  alt="Community Service"
                  className="w-full h-full"
                  style={{ objectPosition: 'center center' }}
                />
              </div>
            </div>

            <div>
              <p className="eyebrow mb-4">Public Welfare</p>
              <h2 className="section-title mb-4" style={{ maxWidth: 360 }}>Serving Where It Matters Most</h2>
              <div className="gold-rule mb-6" />
              <p style={{ fontSize: '0.95rem', color: 'var(--gray-mid)', lineHeight: 1.85, marginBottom: '1rem' }}>
                {name}'s social service programs reach vulnerable communities — offering tangible relief, advocacy, and educational opportunity.
              </p>
              <p style={{ fontSize: '0.95rem', color: 'var(--gray-mid)', lineHeight: 1.85 }}>
                Each initiative is driven by a sincere commitment to human dignity and the belief that systemic change begins with consistent grassroots action and collaboration.
              </p>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Services grid */}
      <div style={{ background: 'var(--cream)', padding: 'var(--sp-xl) 0' }}>
        <div className="container-custom">
          <SectionTitle label="Initiatives" title="Areas of Service" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayServices.map(s => {
              const Icon = s.icon ? (typeof s.icon === 'string' ? (iconMap[s.icon] || Heart) : s.icon) : Heart;
              return (
                <div
                  key={s.title}
                  className="card card-hover-effect"
                  style={{
                    padding: '2rem 1.75rem',
                    borderLeft: '3px solid var(--gold)',
                    display: 'flex', alignItems: 'center', gap: '1rem',
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 8, flexShrink: 0,
                    background: 'var(--navy)', color: 'var(--gold)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Icon size={20} />
                  </div>
                  <h3 className="font-display font-semibold" style={{ fontSize: '1rem', color: 'var(--navy)' }}>{s.title}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* CMS-managed banner */}
      <div className="relative overflow-hidden" style={{ height: 'clamp(350px, 60vh, 520px)' }}>
        <LazyImage
          src={optimizeCloudinaryUrl(bannerImg)}
          alt="Community Service"
          className="absolute inset-0 w-full h-full"
          style={{ objectPosition: 'center 30%' }}
        />
        <div className="overlay-premium" />
      </div>

    </PageContainer>
  )
})

export default SocialServices
