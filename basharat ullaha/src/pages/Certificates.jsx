import { memo } from 'react'
import { FileText } from 'lucide-react'
import PageContainer from '../components/PageContainer'
import PageHero from '../components/PageHero'
import SectionWrapper from '../components/SectionWrapper'
import SectionTitle from '../components/SectionTitle'
import { useCollection } from '../hooks/useFirebaseData'
import { useSiteAssets } from '../context/SiteAssetsContext'
import { useSEO } from '../lib/useSEO'
import { images } from '../data/imageImports'
import { optimizeCloudinaryUrl } from '../utils/optimizeCloudinaryUrl'
import LazyImage from '../components/LazyImage'

const certificates = [
  { title: 'Certification in Human Rights and Social Justice Initiatives', type: 'Certification' },
  { title: 'Participation certificates from NGOs and social organizations', type: 'Participation' },
  { title: 'Recognition certificates for community service and leadership roles', type: 'Recognition' },
]

const Certificates = memo(function Certificates() {
  const { items, loading } = useCollection('certificates')
  const { assets } = useSiteAssets()

  useSEO({
    title: 'Certificates',
    description: 'Formal certifications and recognition certificates of Mohd Basharath Ullah in humanitarian service, human rights and community leadership.',
    canonical: '/certificates',
  })

  const bannerImg = assets.servicesBanner || images.gallery.certificates[0]

  return (
    <PageContainer>
      <PageHero
        title="Certificates"
        subtitle="Formal qualifications and recognitions in humanitarian and public service domains."
      />

      <SectionWrapper>
        <div className="container-custom">
          <SectionTitle label="Credentials" title="Certificates" align="left" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {(items && items.length > 0 ? items : certificates).map((cert) => (
              <div
                key={cert.title}
                className="card"
                style={{
                  display: 'flex', alignItems: 'center', gap: '1.25rem',
                  padding: '1.5rem', transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 7, flexShrink: 0,
                  background: 'var(--navy)', color: 'var(--gold)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <FileText size={20} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 className="font-display font-semibold" style={{ fontSize: '1.05rem', color: 'var(--navy)', lineHeight: 1.3 }}>
                    {cert.title}
                  </h3>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: 'var(--gold-dark)',
                  }}>{cert.type}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <SectionTitle label="Database" title="Complete Record" align="left" />
            {loading ? (
              <div className="flex justify-start py-8">
                <div className="w-8 h-8 border-2 border-[var(--navy)] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : items.length === 0 ? (
              <p className="text-[var(--gray-mid)]">More records will be added soon.</p>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-5 rounded-xl border border-[rgba(201,168,76,0.15)] flex items-center gap-4 hover:border-[rgba(201,168,76,0.4)] transition-colors shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[rgba(11,29,53,0.05)] text-[var(--navy)] flex items-center justify-center shrink-0">
                      <FileText size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display font-semibold text-[1rem] text-[var(--navy)] truncate">
                        {item.title}
                      </h4>
                      <p className="text-[0.8rem] text-[var(--gray-mid)] truncate">
                        {item.description}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-[0.7rem] font-bold tracking-wider text-[var(--gold)] uppercase bg-[rgba(201,168,76,0.1)] px-2 py-1 rounded">
                        {item.year}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CMS-managed image */}
          <div className="media-container aspect-[16/9] mt-16">
            <LazyImage
              src={optimizeCloudinaryUrl(bannerImg)}
              alt="Certificate"
              className="w-full h-full"
              style={{ objectPosition: 'center center' }}
            />
          </div>
        </div>
      </SectionWrapper>
    </PageContainer>
  )
})

export default Certificates
