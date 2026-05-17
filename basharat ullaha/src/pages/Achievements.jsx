import { memo } from 'react'
import { Trophy, Users, Heart } from 'lucide-react'
import PageContainer from '../components/PageContainer'
import PageHero from '../components/PageHero'
import SectionWrapper from '../components/SectionWrapper'
import SectionTitle from '../components/SectionTitle'
import AchievementCard from '../components/AchievementCard'
import { useCollection } from '../hooks/useFirebaseData'
import { useSiteAssets } from '../context/SiteAssetsContext'
import { useSEO } from '../lib/useSEO'
import { images } from '../data/imageImports'
import { optimizeCloudinaryUrl } from '../utils/optimizeCloudinaryUrl'
import LazyImage from '../components/LazyImage'

const highlights = [
  { icon: Trophy, title: 'Leadership & Vision', description: 'Driving meaningful social impact through principled leadership and collaboration.' },
  { icon: Heart, title: 'Humanitarian Action', description: 'Consistently working toward the welfare of underprivileged communities.' },
  { icon: Users, title: 'Community Empowerment', description: 'Promoting human rights and social justice across national and international platforms.' },
]

const Achievements = memo(function Achievements() {
  const { items, loading } = useCollection('achievements')
  const { assets } = useSiteAssets()

  useSEO({
    title: 'Achievements',
    description: 'Key achievements and major milestones of Mohd Basharath Ullah in humanitarian leadership, community development and social justice advocacy.',
    canonical: '/achievements',
  })

  const bannerImg = assets.achievementsBanner || images.gallery.publicEvents[1]

  return (
    <PageContainer>
      <PageHero
        title="Achievements"
        subtitle="Creating meaningful social impact through service, leadership, and collaboration."
      />

      <SectionWrapper>
        <div className="container-custom">
          <SectionTitle label="Impact" title="Key Focus Areas" align="center" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {highlights.map(item => (
              <AchievementCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Dynamic Timeline Section */}
      <SectionWrapper bg="var(--cream)">
        <div className="container-custom">
          <SectionTitle label="Timeline" title="Major Milestones" align="center" />

          <div className="max-w-3xl mx-auto mt-12 relative">
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-[rgba(11,29,53,0.1)] -translate-x-1/2 hidden md:block" />

            {loading ? (
              <div className="flex justify-center py-12">
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  border: '2px solid rgba(11,29,53,0.1)',
                  borderTopColor: 'var(--gold)',
                  animation: 'spin 0.7s linear infinite',
                }} />
              </div>
            ) : items.length === 0 ? (
              <p className="text-center text-[var(--gray-mid)]">More records will be added soon.</p>
            ) : (
              <div className="space-y-12">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className={`relative flex flex-col md:flex-row gap-8 md:gap-0 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                  >
                    <div className="hidden md:flex absolute left-1/2 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-[var(--gold)] border-4 border-[var(--cream)] shadow-sm z-10" />

                    <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}`}>
                      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_2px_16px_rgba(11,29,53,0.04)] border border-[rgba(201,168,76,0.15)] hover:border-[rgba(201,168,76,0.4)] transition-colors">
                        <span className="inline-block px-3 py-1 bg-[rgba(201,168,76,0.1)] text-[var(--gold)] text-xs font-bold tracking-wider rounded mb-4">
                          {item.year}
                        </span>
                        <h4 className="font-display font-bold text-xl text-[var(--navy)] mb-3">{item.title}</h4>
                        <p className="text-[0.95rem] text-[var(--gray-mid)] leading-relaxed" style={{ whiteSpace: 'pre-line' }}>{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SectionWrapper>

      {/* Full-width CMS banner */}
      <div className="relative overflow-hidden section-banner-height">
        <LazyImage
          src={optimizeCloudinaryUrl(bannerImg)}
          alt="Community Event"
          className="absolute inset-0 w-full h-full"
          style={{ objectPosition: 'center 35%' }}
        />
        <div className="overlay-premium flex items-end">
          <div className="container-custom pb-8">
            <p className="eyebrow mb-2" style={{ color: 'var(--gold)' }}>Service</p>
            <h3 className="font-display font-bold text-white" style={{ fontSize: 'clamp(1.3rem, 3vw, 1.9rem)' }}>
              Dedicated to the Welfare of the Underprivileged
            </h3>
          </div>
        </div>
      </div>

    </PageContainer>
  )
})

export default Achievements
