/**
 * SectionTitle — Minimal editorial heading
 * Props: label (eyebrow), title, subtitle, align ('center' | 'left'), light (bool)
 */
export default function SectionTitle({ label, title, subtitle, align = 'center', light = false }) {
  const center = align === 'center'
  return (
    <div className={`mb-12 ${center ? 'text-center' : ''}`}>
      {label && (
        <p
          className="eyebrow mb-3"
          style={{ color: 'var(--gold)', display: 'block' }}
        >
          {label}
        </p>
      )}
      <h2
        className="section-title mb-4"
        style={{ color: light ? '#fff' : 'var(--navy)' }}
      >
        {title}
      </h2>
      <div className={`gold-rule mb-5 ${center ? 'mx-auto' : ''}`} />
      {subtitle && (
        <p
          className="section-subtitle"
          style={{
            color: light ? 'rgba(255,255,255,0.9)' : 'var(--text-body)',
            margin: center ? '0 auto' : '0',
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
