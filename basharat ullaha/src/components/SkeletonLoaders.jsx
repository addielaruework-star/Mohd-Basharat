/**
 * Skeleton loaders — used as placeholder UI while content loads.
 * Matches the visual weight of the actual content to prevent layout shift.
 */

/* ── Pulse animation class helper ─── */
const pulse = 'animate-pulse bg-slate-800/60 rounded'

/* ── Generic skeleton block ────────────────────────────────────────────────── */
export function SkeletonBlock({ className = '', style = {} }) {
  return <div className={`${pulse} ${className}`} style={style} aria-hidden="true" />
}

/* ── Card-list skeleton (for Achievements / Awards / Certificates lists) ──── */
export function SkeletonCardList({ count = 4 }) {
  return (
    <div className="space-y-4" aria-label="Loading content" role="status">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 flex items-center gap-4">
          <div className={`${pulse} w-10 h-10 rounded-lg shrink-0`} />
          <div className="flex-1 space-y-2">
            <div className={`${pulse} h-4 w-3/4`} />
            <div className={`${pulse} h-3 w-1/2`} />
          </div>
          <div className={`${pulse} h-6 w-14 rounded`} />
        </div>
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  )
}

/* ── Gallery grid skeleton ──────────────────────────────────────────────────── */
export function SkeletonGallery({ count = 8 }) {
  return (
    <div
      className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
      aria-label="Loading gallery"
      role="status"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`${pulse} aspect-[4/3] rounded-xl`} />
      ))}
      <span className="sr-only">Loading gallery…</span>
    </div>
  )
}

/* ── Admin asset card skeleton ─────────────────────────────────────────────── */
export function SkeletonAssetCard({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" aria-label="Loading assets" role="status">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
          <div className={`${pulse} aspect-video w-full`} style={{ background: '#1e293b' }} />
          <div className="p-4 space-y-2">
            <div className={`${pulse} h-4 w-2/3`} />
            <div className={`${pulse} h-3 w-full`} />
          </div>
        </div>
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  )
}

/* ── Profile skeleton ──────────────────────────────────────────────────────── */
export function SkeletonProfile() {
  return (
    <div className="max-w-4xl space-y-8 pb-12" aria-label="Loading profile" role="status">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className={`${pulse} h-7 w-48`} />
          <div className={`${pulse} h-4 w-72`} />
        </div>
        <div className={`${pulse} h-10 w-32 rounded-lg`} />
      </div>
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-slate-900/80 rounded-2xl border border-slate-800 p-8 space-y-4">
          <div className={`${pulse} h-4 w-32`} />
          <div className="grid grid-cols-2 gap-6">
            <div className={`${pulse} h-12 rounded-xl`} />
            <div className={`${pulse} h-12 rounded-xl`} />
          </div>
        </div>
      ))}
      <span className="sr-only">Loading profile…</span>
    </div>
  )
}
