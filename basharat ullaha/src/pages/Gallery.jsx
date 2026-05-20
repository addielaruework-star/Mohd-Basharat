/**
 * Gallery — Hybrid CMS System.
 *
 * Architecture:
 * - Local assets are ALWAYS shown as fallback/seed content
 * - Firestore/Cloudinary images are shown FIRST (newest uploads)
 * - Both render together seamlessly
 * - Admin-uploaded images show a delete badge; local ones show "Default"
 */
import { useState, useCallback, memo, useMemo } from 'react'
import { m, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import PageContainer from '../components/PageContainer'
import PageHero from '../components/PageHero'
import { useCollection } from '../hooks/useFirebaseData'
import { useSEO } from '../lib/useSEO'
import { SkeletonGallery } from '../components/SkeletonLoaders'
import { galleryData } from '../data/galleryData'
import { optimizeCloudinaryUrl } from '../utils/optimizeCloudinaryUrl'
import LazyImage from '../components/LazyImage'
import { parseRichText } from '../utils/richText'

const CATS = [
  'All',
  'Social Activity',
  'Milestone',
  'Meetings',
  'Newspaper',
]

const Gallery = memo(function Gallery() {
  const { items: firestoreItems, loading } = useCollection('gallery')
  const [active, setActive] = useState('All')
  const [modal, setModal] = useState(null)
  const [idx, setIdx] = useState(null)
  const [visibleCount, setVisibleCount] = useState(12) // Initial batch size

  useSEO({
    title: 'Photo Gallery',
    description: 'A visual chronicle of Mohd Basharath Ullah’s social service, community events, awards ceremonies and humanitarian work.',
    canonical: '/gallery',
  })

  // ── HYBRID MERGE ────────────────────────────────────────────────
  // Firestore images appear first (newest CMS content),
  // then local seed images fill the rest.
  // We deduplicate by URL to prevent showing same image twice
  // if it ever gets seeded into Firestore manually.
  const mergedItems = useMemo(() => {
    const seen = new Set()
    const result = []
    // CMS images first
    for (const item of firestoreItems) {
      if (item.url && !seen.has(item.url)) {
        seen.add(item.url)
        result.push({ ...item, isLocal: false })
      }
    }
    // Local seed images append
    for (const item of galleryData) {
      if (item.url && !seen.has(item.url)) {
        seen.add(item.url)
        result.push({ ...item, isLocal: true })
      }
    }
    return result
  }, [firestoreItems])

  const filtered = active === 'All' ? mergedItems : mergedItems.filter(i => {
    if (active === 'Social Activity') {
      return i.category === 'Social Activity' || i.category === 'Social Activities';
    }
    if (active === 'Milestone') {
      return i.category === 'Achievements' || i.category === 'Milestone' || i.category === 'Awards & Felicitations' || i.category === 'Certificates & Achievements';
    }
    if (active === 'Meetings') {
      return i.category === 'Meetings' || i.category === 'Meetings & Conferences';
    }
    if (active === 'Newspaper') {
      return i.category === 'Newspaper' || i.category === 'Public Events & Speaking' || i.category === 'Media Coverage' || i.category === 'Media';
    }
    return i.category === active;
  })
  
  // Phase 9 Step 4: Separate images and videos
  const allImages = useMemo(() => filtered.filter(i => i.type !== 'video'), [filtered])
  const allVideos = useMemo(() => filtered.filter(i => i.type === 'video'), [filtered])
  
  const imageItems = allImages.slice(0, visibleCount)
  const videoItems = allVideos.slice(0, visibleCount)

  const open = useCallback((item, i) => { setModal(item); setIdx(i) }, [])
  const close = useCallback(() => { setModal(null); setIdx(null) }, [])
  const prev = useCallback(() => {
    if (idx > 0) { setModal(filtered[idx - 1]); setIdx(idx - 1) }
  }, [idx, filtered])
  const next = useCallback(() => {
    if (idx < filtered.length - 1) { setModal(filtered[idx + 1]); setIdx(idx + 1) }
  }, [idx, filtered])

  const renderCard = (item) => {
    const originalIndex = filtered.findIndex(f => f.id === item.id);
    return (
      <div
        key={item.id}
        onClick={() => open(item, originalIndex)}
        className="masonry-item gallery-card"
        style={{
          borderRadius: 12,
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          display: 'block',
          boxShadow: '0 2px 12px rgba(11,29,53,0.06)',
        }}
      >
        {item.type === 'video' ? (
          <div className="w-full relative aspect-video" style={{ display: 'block', overflow: 'hidden' }}>
            <video
              src={optimizeCloudinaryUrl(item.url)}
              className="w-full"
              style={{ height: 'auto', display: 'block', objectFit: 'cover' }}
              preload="metadata"
              playsInline
              muted
            />
            {/* Play symbol badge overlay */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              background: 'rgba(11,29,53,0.85)', backdropFilter: 'blur(4px)',
              borderRadius: '50%', width: 44, height: 44,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.25)',
              color: '#c9a84c',
            }}>
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" style={{ marginLeft: 2 }}><path d="M8 5v14l11-7z"/></svg>
            </div>
            <div style={{
              position: 'absolute', top: 8, left: 8,
              background: '#c9a84c',
              color: '#07101e',
              fontSize: '0.55rem', fontWeight: 800,
              letterSpacing: '0.08em',
              padding: '3px 8px', borderRadius: 4,
              textTransform: 'uppercase',
            }}>Video</div>
          </div>
        ) : (
          <LazyImage
            src={optimizeCloudinaryUrl(item.url)}
            alt={item.caption}
            className="w-full"
            style={{ height: 'auto', display: 'block' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = galleryData[0]?.url || '';
            }}
          />
        )}
        {/* Hover overlay */}
        <div className="gallery-overlay">
          <p style={{
            fontSize: '0.9rem',
            fontWeight: 700,
            fontFamily: 'var(--font-body)',
            letterSpacing: '0.05em',
            color: '#fff',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
          }}>
            {item.category}
          </p>
        </div>
        {/* Local badge */}
        {item.isLocal && (
          <div style={{
            position: 'absolute', top: 8, right: 8,
            background: 'rgba(11,29,53,0.75)',
            backdropFilter: 'blur(4px)',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '0.6rem', fontWeight: 700,
            letterSpacing: '0.08em',
            padding: '3px 8px', borderRadius: 4,
            textTransform: 'uppercase',
          }}>Default</div>
        )}
      </div>
    );
  };

  return (
    <PageContainer>
      <PageHero
        title="Photo Gallery"
        subtitle="A visual chronicle of service, community leadership, and humanitarian impact."
      />

      <section style={{ padding: '4rem 0 6rem' }}>
        <div className="container-custom">

          {/* Filter tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {CATS.map(cat => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                style={{
                  padding: '0.6rem 1.4rem',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  borderRadius: 6,
                  border: active === cat ? '2px solid var(--navy)' : '2px solid rgba(11,29,53,0.2)',
                  background: active === cat ? 'var(--navy)' : '#fff',
                  color: active === cat ? 'var(--gold)' : 'var(--text-body)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'var(--font-body)',
                  boxShadow: active === cat ? '0 2px 8px rgba(11,29,53,0.12)' : 'none',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Count badge */}
          {!loading && (
            <p className="text-center text-sm text-[var(--gray-mid)] mb-8">
              {filtered.length} image{filtered.length !== 1 ? 's' : ''} · {firestoreItems.length} uploaded · {galleryData.length} defaults
            </p>
          )}

          {loading ? (
            <SkeletonGallery count={8} />
          ) : (
            <>
              <div key={active} className="flex flex-col md:flex-row gap-8 lg:gap-12 w-full">
                {/* Images Column */}
                <div className="flex-1 w-full md:w-1/2">
                  <h3 className="font-display text-xl font-bold text-slate-700 mb-6 border-b border-slate-200 pb-3">
                    Images
                  </h3>
                  {imageItems.length === 0 ? (
                    <p className="text-slate-400 text-sm">No images found for this category.</p>
                  ) : (
                    <div className="columns-1 sm:columns-2 gap-6">
                      {imageItems.map(item => renderCard(item))}
                    </div>
                  )}
                </div>

                {/* Videos Column */}
                <div className="flex-1 w-full md:w-1/2">
                  <h3 className="font-display text-xl font-bold text-slate-700 mb-6 border-b border-slate-200 pb-3">
                    Videos
                  </h3>
                  {videoItems.length === 0 ? (
                    <p className="text-slate-400 text-sm">No videos found for this category.</p>
                  ) : (
                    <div className="columns-1 sm:columns-2 gap-6">
                      {videoItems.map(item => renderCard(item))}
                    </div>
                  )}
                </div>
              </div>

              {/* Sentinel for infinite scroll */}
              {visibleCount < Math.max(allImages.length, allVideos.length) && (
                <div 
                  ref={(el) => {
                    if (!el) return
                    const observer = new IntersectionObserver(([entry]) => {
                      if (entry.isIntersecting) {
                        setVisibleCount(prev => prev + 12)
                      }
                    }, { rootMargin: '600px' })
                    observer.observe(el)
                  }}
                  style={{ height: 20, margin: '2rem 0' }}
                />
              )}
            </>
          )}
        </div>
      </section>

      {/* Fullscreen modal */}
      <AnimatePresence>
        {modal && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(7,16,30,0.95)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
            onClick={close}
          >
            <m.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative rounded-xl overflow-hidden"
              style={{ width: '90vw', maxWidth: 760, background: 'var(--navy)' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{
                height: '75vh', minHeight: 300,
                background: '#0b2040',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
                width: '100%',
              }}>
                {modal.type === 'video' ? (
                  <video
                    src={optimizeCloudinaryUrl(modal.url)}
                    style={{ objectFit: 'contain', maxHeight: '75vh', width: 'auto', margin: '0 auto', outline: 'none' }}
                    controls
                    preload="metadata"
                    playsInline
                    autoPlay
                  />
                ) : (
                  <LazyImage
                    src={optimizeCloudinaryUrl(modal.url)}
                    alt={modal.caption}
                    className=""
                    style={{ background: 'transparent' }}
                    imgStyle={{ objectFit: 'contain', maxHeight: '75vh', width: 'auto', height: 'auto', margin: '0 auto' }}
                  />
                )}
              </div>

              <div style={{ padding: '1.5rem 2rem 2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="eyebrow mb-1.5" style={{ color: 'var(--gold-light)', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em' }}>
                  {modal.category}
                </p>
                <h4 className="font-display font-bold text-white mb-2" style={{ fontSize: '1.25rem', lineHeight: 1.3 }}>
                  {parseRichText(modal.title ? modal.title : (modal.caption ? modal.caption : "Untitled Asset"))}
                </h4>
                {modal.title && modal.caption && (
                  <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {parseRichText(modal.caption)}
                  </p>
                )}
                {modal.isLocal && (
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', marginTop: '0.75rem' }}>Local default image</p>
                )}
              </div>

              <button
                onClick={close}
                style={{
                  position: 'absolute', top: 16, right: 16,
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)', border: 'none',
                  cursor: 'pointer', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.35)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              >
                <X size={24} />
              </button>

              {idx > 0 && <NavBtn side="left" onClick={prev}><ChevronLeft size={18} /></NavBtn>}
              {idx < filtered.length - 1 && <NavBtn side="right" onClick={next}><ChevronRight size={18} /></NavBtn>}
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </PageContainer>
  )
})

export default Gallery

function NavBtn({ side, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'absolute',
        top: '50%', transform: 'translateY(-50%)',
        [side]: 20,
        width: 48, height: 48, borderRadius: '50%',
        background: 'rgba(255,255,255,0.25)', border: 'none',
        cursor: 'pointer', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.6)'}
      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
    >
      {children}
    </button>
  )
}
