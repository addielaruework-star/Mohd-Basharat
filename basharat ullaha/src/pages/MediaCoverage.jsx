import { memo, useState, useMemo, useCallback, lazy, Suspense } from 'react'
import { Newspaper, Mic2, Users, Radio, ExternalLink, Play, X, Calendar, Tag } from 'lucide-react'
import PageContainer from '../components/PageContainer'
import PageHero from '../components/PageHero'
import SectionWrapper from '../components/SectionWrapper'
import SectionTitle from '../components/SectionTitle'
import { useCollection } from '../hooks/useFirebaseData'
import { useSEO } from '../lib/useSEO'
import { optimizeCloudinaryUrl } from '../utils/optimizeCloudinaryUrl'
import LazyImage from '../components/LazyImage'

// ─── Category config ──────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'All',            label: 'All',            icon: Radio },
  { id: 'Newspapers',     label: 'Newspapers',     icon: Newspaper },
  { id: 'Press Coverage', label: 'Press Coverage', icon: Radio },
  { id: 'Interviews',     label: 'Interviews',     icon: Mic2 },
  { id: 'Conferences',    label: 'Conferences',    icon: Users },
  { id: 'Public Speaking',label: 'Public Speaking',icon: Mic2 },
]

// ─── YouTube URL helpers ───────────────────────────────────────────────────────
function extractYouTubeId(url) {
  if (!url) return null
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/)
  return m ? m[1] : null
}

function getYouTubeThumbnail(url) {
  const id = extractYouTubeId(url)
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null
}

// ─── Category icon lookup ─────────────────────────────────────────────────────
function CategoryIcon({ category, size = 14 }) {
  const cfg = CATEGORIES.find(c => c.id === category)
  if (!cfg) return null
  const Icon = cfg.icon
  return <Icon size={size} />
}

// ─── Media Card ───────────────────────────────────────────────────────────────
const MediaCard = memo(function MediaCard({ item, onOpenModal }) {
  const ytThumb = item.videoUrl ? getYouTubeThumbnail(item.videoUrl) : null
  const imgSrc  = item.image ? optimizeCloudinaryUrl(item.image) : ytThumb

  const hasVideo  = Boolean(item.videoUrl)
  const hasImage  = Boolean(imgSrc)

  return (
    <article
      className="card card-hover-effect group cursor-pointer"
      style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
      onClick={() => onOpenModal(item)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onOpenModal(item)}
      aria-label={`View media item: ${item.title}`}
    >
      {/* Image / Thumbnail */}
      <div
        style={{
          position: 'relative',
          aspectRatio: '16/9',
          background: 'var(--navy-mid)',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {hasImage ? (
          <LazyImage
            src={imgSrc}
            alt={item.title}
            className="w-full h-full"
            style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
          />
        ) : (
          <div
            style={{
              width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)',
            }}
          >
            <Newspaper size={32} style={{ color: 'rgba(201,168,76,0.4)' }} />
          </div>
        )}

        {/* Overlay on hover */}
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'rgba(11,29,53,0.55)',
            opacity: 0, transition: 'opacity 0.25s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          className="group-hover:opacity-100"
        >
          {hasVideo ? (
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'rgba(201,168,76,0.95)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            }}>
              <Play size={20} fill="#0b1d35" style={{ color: '#0b1d35', marginLeft: 3 }} />
            </div>
          ) : (
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.25)',
            }}>
              <ExternalLink size={16} style={{ color: '#fff' }} />
            </div>
          )}
        </div>

        {/* Category badge */}
        <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
            background: 'var(--navy)', color: 'var(--gold)',
            fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.08em',
            textTransform: 'uppercase', padding: '0.25rem 0.6rem',
            borderRadius: 4, border: '1px solid rgba(201,168,76,0.25)',
          }}>
            <CategoryIcon category={item.category} size={10} />
            {item.category}
          </span>
        </div>

        {/* Video badge */}
        {hasVideo && (
          <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
            <span style={{
              background: 'rgba(201,168,76,0.9)', color: '#0b1d35',
              fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.1em',
              textTransform: 'uppercase', padding: '0.2rem 0.5rem', borderRadius: 3,
            }}>VIDEO</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {item.date && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
            fontSize: '0.72rem', color: 'var(--gray-mid)', fontWeight: 500,
          }}>
            <Calendar size={11} />
            {item.date}
          </span>
        )}
        <h3
          className="font-display font-bold"
          style={{ fontSize: '1rem', color: 'var(--navy)', lineHeight: 1.35, margin: 0 }}
        >
          {item.title}
        </h3>
        {item.description && (
          <p style={{
            fontSize: '0.85rem', color: 'var(--gray-mid)', lineHeight: 1.65,
            margin: 0,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {item.description}
          </p>
        )}
      </div>
    </article>
  )
})

// ─── Modal — deferred, renders only when opened ───────────────────────────────
const MediaModal = memo(function MediaModal({ item, onClose }) {
  if (!item) return null

  const ytId    = extractYouTubeId(item.videoUrl)
  const ytThumb = item.image ? null : getYouTubeThumbnail(item.videoUrl)
  const imgSrc  = item.image ? optimizeCloudinaryUrl(item.image) : ytThumb

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(11,29,53,0.92)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          maxWidth: 680,
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 24px 80px rgba(11,29,53,0.5)',
          border: '1px solid rgba(201,168,76,0.2)',
          position: 'relative',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute', top: '1rem', right: '1rem', zIndex: 10,
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(11,29,53,0.08)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--navy)',
            transition: 'background 0.2s',
          }}
        >
          <X size={18} />
        </button>

        {/* Image */}
        {imgSrc && (
          <div style={{ aspectRatio: '16/9', overflow: 'hidden', borderRadius: '16px 16px 0 0', background: 'var(--navy-mid)' }}>
            <LazyImage
              src={imgSrc}
              alt={item.title}
              className="w-full h-full"
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}

        {/* Content */}
        <div style={{ padding: '1.5rem 2rem 2rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
              fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'var(--gold-dark)',
              background: 'rgba(201,168,76,0.1)', padding: '0.25rem 0.65rem',
              borderRadius: 4,
            }}>
              <Tag size={10} /> {item.category}
            </span>
            {item.date && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                fontSize: '0.65rem', fontWeight: 600, color: 'var(--gray-mid)',
                background: 'rgba(11,29,53,0.05)', padding: '0.25rem 0.65rem',
                borderRadius: 4,
              }}>
                <Calendar size={10} /> {item.date}
              </span>
            )}
          </div>

          <h2 className="font-display font-bold" style={{ fontSize: 'clamp(1.2rem, 3vw, 1.55rem)', color: 'var(--navy)', lineHeight: 1.25, marginBottom: '0.75rem' }}>
            {item.title}
          </h2>

          {item.description && (
            <p style={{ fontSize: '0.92rem', color: 'var(--gray-mid)', lineHeight: 1.75, whiteSpace: 'pre-line', marginBottom: '1.25rem' }}>
              {item.description}
            </p>
          )}

          {/* YouTube CTA — opens in new tab, no autoplay/embed for performance */}
          {ytId && (
            <a
              href={item.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                background: '#ff0000', color: '#fff',
                padding: '0.65rem 1.4rem', borderRadius: 8,
                fontSize: '0.875rem', fontWeight: 700,
                textDecoration: 'none',
                transition: 'opacity 0.2s',
              }}
            >
              <Play size={16} fill="#fff" /> Watch on YouTube
            </a>
          )}
        </div>
      </div>
    </div>
  )
})

// ─── Main Page ────────────────────────────────────────────────────────────────
const MediaCoverage = memo(function MediaCoverage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [modalItem, setModalItem] = useState(null)

  const { items, loading } = useCollection('mediaCoverage')

  useSEO({
    title: 'Media Coverage',
    description: 'Press coverage, newspaper publications, interviews, and conference highlights featuring Mohd Basharath Ullah in humanitarian leadership and social impact.',
    canonical: '/media-coverage',
  })

  // Memoized filter — Phase 6/7 safe, no recalculation on unrelated renders
  const filtered = useMemo(() => {
    if (activeCategory === 'All') return items
    return items.filter(i => i.category === activeCategory)
  }, [items, activeCategory])

  const handleTabClick   = useCallback((id) => setActiveCategory(id), [])
  const handleOpenModal  = useCallback((item) => setModalItem(item), [])
  const handleCloseModal = useCallback(() => setModalItem(null), [])

  return (
    <PageContainer>
      <PageHero
        title="Media Coverage"
        subtitle="A documented journey through public recognition, press coverage, conferences, and social impact storytelling."
      />

      {/* ─── Category Filter Tabs ──────────────────────────────────── */}
      <div
        style={{
          position: 'sticky', top: 72,
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
            aria-label="Media coverage categories"
            style={{ display: 'flex', gap: 0, overflowX: 'auto', scrollbarWidth: 'none' }}
          >
            {CATEGORIES.map(({ id, label, icon: Icon }) => {
              const isActive = activeCategory === id
              return (
                <button
                  key={id}
                  id={`media-tab-${id.replace(/\s/g, '-')}`}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleTabClick(id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    padding: '1rem 1.1rem',
                    fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.03em',
                    color: isActive ? 'var(--gold-dark)' : 'var(--gray-mid)',
                    background: 'none', border: 'none',
                    borderBottom: isActive ? '2.5px solid var(--gold)' : '2.5px solid transparent',
                    cursor: 'pointer', whiteSpace: 'nowrap',
                    transition: 'color 0.2s, border-color 0.2s',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={14} />
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ─── Cards Grid ────────────────────────────────────────────── */}
      <SectionWrapper>
        <div className="container-custom">
          <SectionTitle
            label="Coverage"
            title={activeCategory === 'All' ? 'All Media Coverage' : activeCategory}
            align="left"
          />

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2.5rem' }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{
                  borderRadius: 12, overflow: 'hidden',
                  background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)',
                  opacity: 0.35, animation: 'spin 2s linear infinite',
                }}>
                  <div style={{ aspectRatio: '16/9' }} />
                  <div style={{ padding: '1.25rem' }}>
                    <div style={{ height: 12, background: 'rgba(255,255,255,0.15)', borderRadius: 6, marginBottom: '0.75rem', width: '60%' }} />
                    <div style={{ height: 16, background: 'rgba(255,255,255,0.15)', borderRadius: 6, marginBottom: '0.5rem' }} />
                    <div style={{ height: 16, background: 'rgba(255,255,255,0.1)', borderRadius: 6, width: '80%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
              <Newspaper size={40} style={{ color: 'rgba(201,168,76,0.4)', margin: '0 auto 1rem' }} />
              <p className="font-display font-bold" style={{ fontSize: '1.25rem', color: 'var(--navy)', marginBottom: '0.5rem' }}>
                {activeCategory === 'All' ? 'No media coverage added yet.' : `No ${activeCategory} items yet.`}
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--gray-mid)' }}>Check back soon for updates.</p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                gap: '1.5rem',
                marginTop: '2.5rem',
              }}
            >
              {filtered.map(item => (
                <MediaCard key={item.id} item={item} onOpenModal={handleOpenModal} />
              ))}
            </div>
          )}
        </div>
      </SectionWrapper>

      {/* ─── Modal — only mounted when an item is selected ─────────── */}
      {modalItem && <MediaModal item={modalItem} onClose={handleCloseModal} />}
    </PageContainer>
  )
})

export default MediaCoverage
