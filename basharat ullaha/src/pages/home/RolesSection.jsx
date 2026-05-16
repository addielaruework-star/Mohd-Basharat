import { memo } from 'react'
import LazyImage from '../../components/LazyImage'
import { optimizeCloudinaryUrl } from '../../utils/optimizeCloudinaryUrl'
import { images } from '../../data/imageImports'

const RolesSection = memo(function RolesSection({ assets }) {
  return (
    <div style={{ background: 'var(--cream)', padding: 'var(--sp-xl) 0' }}>
      <div className="container-custom">
        <div className="split-section" style={{ alignItems: 'flex-start' }}>
          <div>
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
          </div>

          <div>
            <div className="media-container aspect-[4/3]" style={{ border: '1px solid rgba(201,168,76,0.15)' }}>
              <LazyImage
                src={optimizeCloudinaryUrl(assets.aboutBanner || images.gallery.meetings[0])}
                alt="Leadership Photo"
                className="w-full h-full"
                style={{ objectPosition: 'center 35%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default RolesSection
