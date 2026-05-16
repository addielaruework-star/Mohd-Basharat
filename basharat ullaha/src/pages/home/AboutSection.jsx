import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import SectionWrapper from '../../components/SectionWrapper'
import LazyImage from '../../components/LazyImage'
import { optimizeCloudinaryUrl } from '../../utils/optimizeCloudinaryUrl'
import { images } from '../../data/imageImports'

export default function AboutSection({ profile, assets }) {
  return (
    <SectionWrapper>
      <div className="container-custom">
        <div className="split-section">
          <div>
            <div className="media-container aspect-[3/4]" style={{ border: '1px solid rgba(201,168,76,0.15)' }}>
              <LazyImage
                src={optimizeCloudinaryUrl(assets.biographyImage || images.gallery.publicEvents[0])}
                alt="Event Photo"
                className="w-full h-full"
                style={{ objectPosition: 'center 35%' }}
              />
            </div>
          </div>

          <div>
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
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
