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

const CATS = [
  'All',
  'Social Activities',
  'Awards & Felicitations',
  'Meetings & Conferences',
  'Public Events & Speaking',
  'Certificates & Achievements',
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

  const filtered = active === 'All' ? mergedItems : mergedItems.filter(i => i.category === active)
  const visibleItems = filtered.slice(0, visibleCount)

  const open = useCallback((item, i) => { setModal(item); setIdx(i) }, [])
  const close = useCallback(() => { setModal(null); setIdx(null) }, [])
  const prev = useCallback(() => {
    if (idx > 0) { setModal(filtered[idx - 1]); setIdx(idx - 1) }
  }, [idx, filtered])
  const next = useCallback(() => {
    if (idx < filtered.length - 1) { setModal(filtered[idx + 1]); setIdx(idx + 1) }
  }, [idx, filtered])

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
              <div key={active} className="masonry-grid">

                {visibleItems.map((item, i) => (
                  <div
                    key={item.id}
                    onClick={() => open(item, i)}
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
                ))}
              </div>

              {/* Sentinel for infinite scroll */}
              {visibleCount < filtered.length && (
                <div 
                  ref={(el) => {
                    if (!el) return
                    const observer = new IntersectionObserver(([entry]) => {
                      if (entry.isIntersecting) {
                        setVisibleCount(prev => prev + 12)
                      }
                    }, { rootMargin: '600px' })
                    observer.observe(el)
                    // Note: In this simple one-off observer, we rely on the sentinel being removed 
                    // when visibleCount increases or active category changes.
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
                height: '65vh', minHeight: 300, maxHeight: 600,
                background: '#0b2040',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
              }}>
                <LazyImage
                  src={optimizeCloudinaryUrl(modal.url)}
                  alt={modal.caption}
                  className="w-full h-full"
                  style={{ objectFit: 'contain' }}
                />
              </div>

              <div style={{ padding: '1.5rem 2rem 2rem' }}>
                <p className="eyebrow mb-2" style={{ color: 'var(--gold-light)' }}>{modal.category}</p>
                {modal.caption && <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem', whiteSpace: 'pre-line' }}>{modal.caption}</p>}
                {modal.isLocal && (
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem', marginTop: '0.5rem' }}>Local default image</p>
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
