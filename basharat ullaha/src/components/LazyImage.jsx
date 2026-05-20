import { useState, memo } from 'react'

/**
 * A lightweight, reusable progressive image component.
 * Uses a minimal solid background as a skeleton/placeholder while loading.
 */
const LazyImage = memo(function LazyImage({
  src,
  alt,
  className = '',
  style = {},
  imgStyle = {},
  isHero = false, // Set to true for LCP images
  onError,
  ...props
}) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  const handleLoad = () => setLoaded(true)
  
  const handleError = (e) => {
    setError(true)
    if (onError) onError(e)
  }

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ 
        backgroundColor: 'rgba(11, 29, 53, 0.03)', // Extremely subtle background
        ...style 
      }}
    >
      {!error ? (
        <img
          src={src}
          alt={alt}
          loading={isHero ? 'eager' : 'lazy'}
          decoding={isHero ? 'sync' : 'async'}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            width: '100%',
            height: '100%',
            objectFit: style.objectFit || 'cover',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.4s ease-out',
            display: 'block',
            filter: loaded ? 'none' : 'blur(4px)', // Optional: tiny blur during transition
            ...imgStyle,
          }}
          {...props}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
          Image Unavailable
        </div>
      )}
      
      {/* Subtle shimmer effect only while loading and not hero */}
      {!loaded && !error && !isHero && (
        <div className="absolute inset-0 animate-pulse bg-white/5" />
      )}
    </div>
  )
})

export default LazyImage
