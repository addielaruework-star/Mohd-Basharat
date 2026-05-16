import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function MissionSection() {
  return (
    <div
      className="relative overflow-hidden"
      style={{ background: 'var(--navy)', padding: 'var(--sp-xl) 0' }}
    >
      <div
        className="absolute inset-0 opacity-4"
        style={{ backgroundImage: 'repeating-linear-gradient(-60deg, rgba(201,168,76,0.1) 0px, rgba(201,168,76,0.1) 1px, transparent 1px, transparent 48px)' }}
      />
      <div className="container-custom relative z-10 text-center" style={{ maxWidth: 720 }}>
        <p className="eyebrow mb-5">Mission</p>
        <blockquote
          className="font-display text-white"
          style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)', lineHeight: 1.45, fontWeight: 600, fontStyle: 'italic' }}
        >
          "To serve humanity by promoting justice, equality, and support for underprivileged communities."
        </blockquote>
        <div className="gold-rule mx-auto mt-7 mb-8" />
        <Link to="/social-services" className="btn-primary">
          View Social Work <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}
