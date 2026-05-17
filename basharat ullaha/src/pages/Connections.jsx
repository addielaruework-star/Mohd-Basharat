import { memo } from 'react'
import { Link as LinkIcon } from 'lucide-react'
import PageContainer from '../components/PageContainer'
import PageHero from '../components/PageHero'
import SectionWrapper from '../components/SectionWrapper'
import SectionTitle from '../components/SectionTitle'
import { useCollection } from '../hooks/useFirebaseData'
import { useSEO } from '../lib/useSEO'
import { images } from '../data/imageImports'
import { optimizeCloudinaryUrl } from '../utils/optimizeCloudinaryUrl'
import LazyImage from '../components/LazyImage'

const connections = [
  'Network with NGOs, activists, and social organizations',
  'Collaborations with community leaders and volunteers',
  'Connections with national and international bodies',
  'Humanitarian and social service networks'
]

const Connections = memo(function Connections() {
  const { items, loading } = useCollection('connections')

  useSEO({
    title: 'Connections',
    description: 'Organizational network and collaborative connections of Mohd Basharath Ullah — NGOs, national and international humanitarian bodies and community leaders.',
    canonical: '/connections',
  })

  return (
    <PageContainer>
      <PageHero
        title="Connections"
        subtitle="Collaborations and networks across national and international humanitarian bodies."
      />

      <SectionWrapper>
        <div className="container-custom">
          <SectionTitle label="Networks" title="Collaborative Impact" align="center" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {connections.map((conn, i) => (
              <div
                key={i}
                className="card"
                style={{
                  padding: '2rem',
                  display: 'flex', alignItems: 'flex-start', gap: '1.25rem',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 8, flexShrink: 0,
                  background: 'var(--navy)', color: 'var(--gold)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <LinkIcon size={20} />
                </div>
                <h3 className="font-display font-semibold" style={{ fontSize: '1.05rem', color: 'var(--navy)', lineHeight: 1.4, paddingTop: '0.2rem' }}>
                  {conn}
                </h3>
              </div>
            ))}
          </div>
          
          <div className="mt-12">
            <SectionTitle label="Database" title="Organizational Network" align="center" />
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-2 border-[var(--navy)] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : items.length === 0 ? (
              <p className="text-center text-[var(--gray-mid)] mt-4">More records will be added soon.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="bg-white p-6 rounded-2xl shadow-[0_2px_16px_rgba(11,29,53,0.04)] border border-[rgba(201,168,76,0.15)] flex gap-5 group hover:border-[rgba(201,168,76,0.4)] transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[rgba(201,168,76,0.1)] text-[var(--gold)] flex items-center justify-center shrink-0">
                      <LinkIcon size={22} />
                    </div>
                    <div>
                      <span className="text-[0.7rem] font-bold text-[var(--gold)] uppercase tracking-wider mb-1 block">
                        {item.year}
                      </span>
                      <h4 className="font-display font-bold text-[1.05rem] text-[var(--navy)] mb-2 leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-[0.85rem] text-[var(--gray-mid)] leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="media-container aspect-[16/9] mt-16">
            <LazyImage
              src={optimizeCloudinaryUrl(images.gallery.meetings[1])}
              alt="Collaboration"
              className="w-full h-full"
              style={{ objectPosition: 'center 30%' }}
            />
          </div>
        </div>
      </SectionWrapper>
    </PageContainer>
  )
})

export default Connections
