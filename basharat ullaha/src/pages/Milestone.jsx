import { memo, useState, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Trophy, Award, FileText, Users, Heart, Star } from 'lucide-react'
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
import { parseRichText } from '../utils/richText'


const iconMap = { Trophy, Star, Award }

const defaultAwards = [
  { icon: Trophy, title: 'Contributions to Social Service', description: 'Recognized for contributions to social service and community welfare.' },
  { icon: Star,   title: 'Promoting Human Rights', description: 'Honored for efforts in promoting human rights.' },
  { icon: Award,  title: 'Leadership in Public Service', description: 'Appreciated for leadership and dedication in public service activities.' },
]

const defaultCerts = [
  { title: 'Certification in Human Rights and Social Justice Initiatives', type: 'Certification' },
  { title: 'Participation certificates from NGOs and social organizations', type: 'Participation' },
  { title: 'Recognition certificates for community service and leadership roles', type: 'Recognition' },
]

const TABS = [
  { id: 'awards',       label: 'Awards',        icon: Award  },
  { id: 'certificates', label: 'Certificates',  icon: FileText },
]

// ─── Sub-panels ───────────────────────────────────────────────────────────────


function AwardsPanel({ items, loading, bannerImg }) {
  const display = items && items.length > 0 ? items : defaultAwards
  return (
    <>
      <SectionWrapper>
        <div className="container-custom">
          <SectionTitle label="Honours" title="Official Recognition" align="center" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 mb-10">
            {display.map((a) => {
              const Icon = a.icon ? (typeof a.icon === 'string' ? (iconMap[a.icon] || Trophy) : a.icon) : Trophy
              return (
                <div
                  key={a.title}
                  className="card"
                  style={{ background: 'linear-gradient(130deg, var(--navy) 0%, var(--navy-light) 100%)', borderRadius: 12, padding: '2.5rem', position: 'relative', overflow: 'hidden', border: '1px solid rgba(201,168,76,0.2)' }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: 10, background: 'rgba(201,168,76,0.15)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                    <Icon size={22} />
                  </div>
                  <h3 className="font-display font-bold text-white" style={{ fontSize: '1.2rem', lineHeight: 1.3, marginBottom: '0.75rem' }}>{a.title}</h3>
                  <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.75 }}>{parseRichText(a.description)}</p>
                  <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 3, background: 'linear-gradient(90deg, transparent, var(--gold))' }} />
                </div>
              )
            })}
          </div>
        </div>
      </SectionWrapper>

      {items.length > 0 && (
        <SectionWrapper bg="var(--cream)">
          <div className="container-custom">
            <SectionTitle label="Database" title="Complete List of Awards" align="center" />
            <div className="max-w-4xl mx-auto mt-12">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-2 border-[var(--navy)] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {items.map(item => (
                    <div key={item.id} className="bg-white p-6 rounded-2xl shadow-[0_2px_16px_rgba(11,29,53,0.04)] border border-[rgba(201,168,76,0.15)] flex gap-5 group hover:border-[rgba(201,168,76,0.4)] transition-all">
                      <div className="w-12 h-12 rounded-xl bg-[rgba(201,168,76,0.1)] text-[var(--gold)] flex items-center justify-center shrink-0"><Award size={22} /></div>
                      <div>
                        <span className="text-[0.7rem] font-bold text-[var(--gold)] uppercase tracking-wider mb-1 block">{item.year}</span>
                        <h4 className="font-display font-bold text-[1.05rem] text-[var(--navy)] mb-2 leading-tight">{item.title}</h4>
                        <p className="text-[0.85rem] text-[var(--gray-mid)] leading-relaxed">{parseRichText(item.description)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </SectionWrapper>
      )}

      <div className="relative overflow-hidden" style={{ height: 'clamp(350px, 60vh, 520px)' }}>
        <LazyImage src={optimizeCloudinaryUrl(bannerImg)} alt="Award Ceremony" className="absolute inset-0 w-full h-full" style={{ objectPosition: 'center 30%' }} />
        <div className="overlay-premium flex items-end">
          <div className="container-custom pb-8">
            <p className="eyebrow mb-2" style={{ color: 'var(--gold)' }}>Gallery</p>
            <h3 className="font-display font-bold text-white" style={{ fontSize: '1.5rem' }}>Award Ceremonies &amp; Felicitations</h3>
          </div>
        </div>
      </div>
    </>
  )
}

function CertificatesPanel({ items, loading, bannerImg }) {
  const display = items && items.length > 0 ? items : defaultCerts
  return (
    <SectionWrapper>
      <div className="container-custom">
        <SectionTitle label="Credentials" title="Certificates" align="left" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {display.map(cert => (
            <div key={cert.title} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}>
              <div style={{ width: 44, height: 44, borderRadius: 7, flexShrink: 0, background: 'var(--navy)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={20} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 className="font-display font-semibold" style={{ fontSize: '1.05rem', color: 'var(--navy)', lineHeight: 1.3 }}>{parseRichText(cert.title)}</h3>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold-dark)' }}>{cert.type}</span>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="mt-12">
            <SectionTitle label="Database" title="Complete Record" align="left" />
            {loading ? (
              <div className="flex justify-start py-8">
                <div className="w-8 h-8 border-2 border-[var(--navy)] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="bg-white p-5 rounded-xl border border-[rgba(201,168,76,0.15)] flex items-center gap-4 hover:border-[rgba(201,168,76,0.4)] transition-colors shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-[rgba(11,29,53,0.05)] text-[var(--navy)] flex items-center justify-center shrink-0"><FileText size={18} /></div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display font-semibold text-[1rem] text-[var(--navy)] truncate">{item.title}</h4>
                      <p className="text-[0.8rem] text-[var(--gray-mid)]">{parseRichText(item.description)}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-[0.7rem] font-bold tracking-wider text-[var(--gold)] uppercase bg-[rgba(201,168,76,0.1)] px-2 py-1 rounded">{item.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="media-container aspect-[16/9] mt-16">
          <LazyImage src={optimizeCloudinaryUrl(bannerImg)} alt="Certificate" className="w-full h-full" style={{ objectPosition: 'center center' }} />
        </div>
      </div>
    </SectionWrapper>
  )
}

// ─── Main Milestone Page ──────────────────────────────────────────────────────
const Milestone = memo(function Milestone() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabQuery = searchParams.get('tab')
  
  const defaultTab = TABS.some(t => t.id === tabQuery) ? tabQuery : 'awards'
  const [activeTab, setActiveTab] = useState(defaultTab)

  useEffect(() => {
    if (tabQuery && TABS.some(t => t.id === tabQuery)) {
      setActiveTab(tabQuery)
    }
  }, [tabQuery])

  const { items: awdItems, loading: awdLoading } = useCollection('awards')
  const { items: cerItems, loading: cerLoading } = useCollection('certificates')
  const { assets } = useSiteAssets()

  useSEO({
    title: 'Milestone',
    description: 'Key milestones, achievements, awards, honours, and certificates of Mohd Basharath Ullah in humanitarian leadership, community development and social justice.',
    canonical: '/milestone',
  })

  const awardsBannerImg  = assets.awardsBanner   || images.gallery.awards[1]
  const certsBannerImg   = assets.servicesBanner || images.gallery.certificates[0]

  const handleTabClick = useCallback((id) => {
    setActiveTab(id)
    setSearchParams({ tab: id }, { replace: true })
  }, [setSearchParams])

  return (
    <PageContainer>
      <PageHero
        title="Milestone"
        subtitle="A record of achievements, honours, and formal certifications in humanitarian service and public leadership."
      />

      {/* ─── Tab Bar ─────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'sticky',
          top: 72, /* height of Navbar */
          zIndex: 30,
          background: 'rgba(255,255,255,0.97)',
          borderBottom: '1px solid rgba(201,168,76,0.18)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      >
        <div className="container-custom">
          <div
            role="tablist"
            aria-label="Milestone categories"
            style={{ display: 'flex', gap: 0, overflowX: 'auto', scrollbarWidth: 'none' }}
          >
            {TABS.map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id
              return (
                <button
                  key={id}
                  id={`milestone-tab-${id}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`milestone-panel-${id}`}
                  onClick={() => handleTabClick(id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '1rem 1.25rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    letterSpacing: '0.03em',
                    color: isActive ? 'var(--gold-dark)' : 'var(--gray-mid)',
                    background: 'none',
                    border: 'none',
                    borderBottom: isActive ? '2.5px solid var(--gold)' : '2.5px solid transparent',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'color 0.2s, border-color 0.2s',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={15} />
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      </div>


      <div
        id="milestone-panel-awards"
        role="tabpanel"
        aria-labelledby="milestone-tab-awards"
        hidden={activeTab !== 'awards'}
      >
        <AwardsPanel items={awdItems} loading={awdLoading} bannerImg={awardsBannerImg} />
      </div>

      <div
        id="milestone-panel-certificates"
        role="tabpanel"
        aria-labelledby="milestone-tab-certificates"
        hidden={activeTab !== 'certificates'}
      >
        <CertificatesPanel items={cerItems} loading={cerLoading} bannerImg={certsBannerImg} />
      </div>


    </PageContainer>
  )
})

export default Milestone
