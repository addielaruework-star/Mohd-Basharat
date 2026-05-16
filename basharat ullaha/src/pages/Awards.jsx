import { memo } from 'react'
import { Trophy, Award, Star } from 'lucide-react'
import PageContainer from '../components/PageContainer'
import PageHero from '../components/PageHero'
import SectionWrapper from '../components/SectionWrapper'
import SectionTitle from '../components/SectionTitle'
import { useCollection } from '../hooks/useFirebaseData'
import { useSiteAssets } from '../context/SiteAssetsContext'
import { useSEO } from '../lib/useSEO'
import { images } from '../data/imageImports'

const iconMap = { Trophy, Star, Award }

const recognitions = [
  { icon: Trophy, title: 'Contributions to Social Service', description: 'Recognized for contributions to social service and community welfare.' },
  { icon: Star, title: 'Promoting Human Rights', description: 'Honored for efforts in promoting human rights.' },
  { icon: Award, title: 'Leadership in Public Service', description: 'Appreciated for leadership and dedication in public service activities.' },
]

const Awards = memo(function Awards() {
  const { items, loading } = useCollection('awards')
  const { assets } = useSiteAssets()

  useSEO({
    title: 'Awards & Recognition',
    description: 'Awards, honours and official recognition received by Mohd Basharath Ullah for contributions to social service, human rights and community welfare.',
    canonical: '/awards',
  })

  const bannerImg = assets.awardsBanner || images.gallery.awards[1]

  return (
    <PageContainer>
      <PageHero
        title="Awards & Recognition"
        subtitle="Recognized for contributions to social service, human rights, and community welfare."
      />

      {/* Featured large awards */}
      <SectionWrapper>
        <div className="container-custom">
          <SectionTitle label="Honours" title="Official Recognition" align="center" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 mb-10">
            {(items && items.length > 0 ? items : recognitions).map((a, i) => {
              const Icon = a.icon ? (typeof a.icon === 'string' ? (iconMap[a.icon] || Trophy) : a.icon) : Trophy;
              return (
                <div
                  key={a.title}
                  className="card"
                  style={{
                    background: 'linear-gradient(130deg, var(--navy) 0%, var(--navy-light) 100%)',
                    borderRadius: 12, padding: '2.5rem',
                    position: 'relative', overflow: 'hidden',
                    border: '1px solid rgba(201,168,76,0.2)',
                  }}
                >
                  <div style={{
                    width: 48, height: 48, borderRadius: 10,
                    background: 'rgba(201,168,76,0.15)', color: 'var(--gold)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '1.25rem',
                  }}>
                    <Icon size={22} />
                  </div>
                
                <h3 className="font-display font-bold text-white" style={{ fontSize: '1.2rem', lineHeight: 1.3, marginBottom: '0.75rem' }}>
                  {a.title}
                </h3>
                <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.75 }}>
                  {a.description}
                </p>
                <div style={{
                  position: 'absolute', top: 0, right: 0, width: 80, height: 3,
                  background: 'linear-gradient(90deg, transparent, var(--gold))',
                }} />
              </div>
              );
            })}
          </div>
        </div>
      </SectionWrapper>

      {/* Dynamic List Section */}
      <SectionWrapper bg="var(--cream)">
        <div className="container-custom">
          <SectionTitle label="Database" title="Complete List of Awards" align="center" />
          
          <div className="max-w-4xl mx-auto mt-12">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-[var(--navy)] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : items.length === 0 ? (
              <p className="text-center text-[var(--gray-mid)]">More records will be added soon.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-white p-6 rounded-2xl shadow-[0_2px_16px_rgba(11,29,53,0.04)] border border-[rgba(201,168,76,0.15)] flex gap-5 group hover:border-[rgba(201,168,76,0.4)] transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[rgba(201,168,76,0.1)] text-[var(--gold)] flex items-center justify-center shrink-0">
                      <Award size={22} />
                    </div>
                    <div>
                      <span className="text-[0.7rem] font-bold text-[var(--gold)] uppercase tracking-wider mb-1 block">
                        {item.year}
                      </span>
                      <h4 className="font-display font-bold text-[1.05rem] text-[var(--navy)] mb-2 leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-[0.85rem] text-[var(--gray-mid)] leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SectionWrapper>

      {/* Full-width image — CMS managed */}
      <div className="relative overflow-hidden" style={{ height: 'clamp(350px, 60vh, 520px)' }}>
        <img
          src={bannerImg}
          alt="Award Ceremony"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center 30%' }}
          loading="lazy"
        />
        <div className="overlay-premium flex items-end">
          <div className="container-custom pb-8">
            <p className="eyebrow mb-2" style={{ color: 'var(--gold)' }}>Gallery</p>
            <h3 className="font-display font-bold text-white" style={{ fontSize: '1.5rem' }}>Award Ceremonies &amp; Felicitations</h3>
          </div>
        </div>
      </div>

    </PageContainer>
  )
})

export default Awards
