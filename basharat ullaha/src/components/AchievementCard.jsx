import { motion } from 'framer-motion'

export default function AchievementCard({ icon: Icon, title, description, year, category }) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 14px 40px rgba(11,29,53,0.12)' }}
      style={{
        background: '#fff',
        borderRadius: 10,
        padding: '1.75rem',
        border: '1px solid rgba(201,168,76,0.1)',
        boxShadow: '0 2px 14px rgba(11,29,53,0.06)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      {/* Gold top accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg, var(--gold-dark), var(--gold-light))',
      }} />

      {/* Icon */}
      {Icon && (
        <div style={{
          width: 40, height: 40, borderRadius: 8,
          background: 'var(--navy)',
          color: 'var(--gold)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon size={18} />
        </div>
      )}

      <div style={{ flex: 1 }}>
        <h3 className="font-display font-bold" style={{ fontSize: '1rem', color: 'var(--navy)', lineHeight: 1.3, marginBottom: '0.5rem' }}>
          {title}
        </h3>
        {description && (
          <p style={{ fontSize: '0.82rem', color: 'var(--gray-mid)', lineHeight: 1.75 }}>
            {description}
          </p>
        )}
      </div>

      {(year || category) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid rgba(201,168,76,0.1)' }}>
          {category && (
            <span style={{
              fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--gold-dark)',
            }}>{category}</span>
          )}
          {year && (
            <span style={{ fontSize: '0.72rem', color: 'var(--gray-mid)' }}>{year}</span>
          )}
        </div>
      )}
    </motion.div>
  )
}
