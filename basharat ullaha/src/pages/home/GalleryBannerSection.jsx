import { memo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import LazyImage from '../../components/LazyImage'
import { optimizeCloudinaryUrl } from '../../utils/optimizeCloudinaryUrl'

const GalleryBannerSection = memo(function GalleryBannerSection({ profile, galleryBannerImg }) {
  return (
    <div className="relative overflow-hidden section-banner-height">
      <LazyImage
        src={optimizeCloudinaryUrl(galleryBannerImg)}
        alt="Visual Chronicle"
        className="absolute inset-0 w-full h-full"
        style={{ objectPosition: 'center 30%' }}
      />
      <div className="overlay-premium flex items-end">
        <div className="container-custom pb-10" style={{ pointerEvents: 'auto' }}>
          <p className="eyebrow mb-2">Gallery</p>
          <h3 className="font-display font-bold text-white mb-4" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>
            {profile?.galleryBannerTitle || 'Visual Chronicle of Service'}
          </h3>
          <Link to="/gallery" className="btn-ghost" style={{ pointerEvents: 'auto' }}>
            View Full Gallery <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
})

export default GalleryBannerSection
