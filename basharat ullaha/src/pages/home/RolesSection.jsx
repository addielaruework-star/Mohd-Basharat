import { memo } from 'react'
import LazyImage from '../../components/LazyImage'
import { optimizeCloudinaryUrl } from '../../utils/optimizeCloudinaryUrl'
import { images } from '../../data/imageImports'
import { useProfile } from '../../hooks/useFirebaseData'
import { parseRichText } from '../../utils/richText'

const RolesSection = memo(function RolesSection({ assets }) {
  const { profile } = useProfile()

  const leadershipPositions = profile?.leadershipPositions || [
    { organization: 'Anti Corruption Foundation of India', title: 'State Chief Director Telangana' },
    { organization: 'International Human Rights & Social Justice Organization', title: 'Ex Vice President' }
  ]

  return (
    <div style={{ background: 'var(--cream)', padding: 'var(--sp-xl) 0' }}>
      <div className="container-custom">
        <div className="split-section" style={{ alignItems: 'flex-start' }}>
          <div>
            <p className="eyebrow mb-3">Leadership &amp; Service</p>
            <h2 className="section-title mb-6">Positions Held</h2>
            <div className="gold-rule mb-8" />

            <ul className="list-none space-y-6">
              {leadershipPositions.map((pos, i) => (
                <li key={i} style={{ borderLeft: '2px solid var(--gold)', paddingLeft: '1.25rem' }}>
                  <h3 className="font-display font-bold" style={{ fontSize: '1.1rem', color: 'var(--navy)' }}>{parseRichText(pos.organization)}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--gray-mid)' }}>{parseRichText(pos.title)}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="media-container aspect-[4/3]" style={{ border: '1px solid rgba(201,168,76,0.15)' }}>
              <LazyImage
                src={optimizeCloudinaryUrl(assets.leadershipImage || images.gallery.meetings[0])}
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
