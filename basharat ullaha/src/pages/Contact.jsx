import { useState, memo } from 'react'
import { Phone, Mail, Send, CheckCircle } from 'lucide-react'
import PageContainer from '../components/PageContainer'
import PageHero from '../components/PageHero'
import SectionWrapper from '../components/SectionWrapper'
import { useProfile } from '../hooks/useFirebaseData'
import { useSEO } from '../lib/useSEO'
import { db } from '../lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import toast from 'react-hot-toast'

// Official Instagram SVG
const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
)

// Official Facebook SVG
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const Contact = memo(function Contact() {
  const { profile, loading: profileLoading } = useProfile()
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useSEO({
    title: 'Contact',
    description: 'Contact Mohd Basharath Ullah to discuss collaborations, community initiatives, speaking engagements or humanitarian partnerships.',
    canonical: '/contact',
  })

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--navy)' }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.15)',
          borderTopColor: 'var(--gold)',
          animation: 'spin 0.7s linear infinite',
        }} />
      </div>
    )
  }

  const phone = profile?.phone || '6281823792'
  const email = profile?.email || 'Mohdbasharath18@gmail.com'
  const instagram = profile?.instagram || 'https://www.instagram.com/mohd.basharath.96'
  const facebook = profile?.facebook || 'https://www.facebook.com/share/r/14btibmxfRQ/'

  const contactDetails = [
    { icon: <Phone size={20} />,  label: 'Phone',     value: phone,                    href: `tel:${phone}` },
    { icon: <Mail size={20} />,   label: 'Email',     value: email,      href: `mailto:${email}` },
    { icon: <InstagramIcon />,    label: 'Instagram', value: 'Instagram Profile',             href: instagram },
    { icon: <FacebookIcon />,     label: 'Facebook',  value: 'Official Facebook',              href: facebook },
  ]

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  
  const handleSubmit = async e => {
    e.preventDefault()
    setIsSubmitting(true)
    const toastId = toast.loading('Sending your message...')

    try {
      await addDoc(collection(db, 'messages'), {
        ...form,
        createdAt: serverTimestamp(),
        read: false,
        important: false
      })
      toast.success('Message sent successfully!', { id: toastId })
      setSent(true)
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (err) {
      console.error(err)
      toast.error('Failed to send message. Please try again.', { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '0.85rem 1.15rem',
    fontSize: '0.95rem', fontFamily: 'var(--font-body)',
    color: 'var(--text-body)',
    background: 'var(--off-white)',
    border: '1px solid rgba(11,29,53,0.15)',
    borderRadius: 8, outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  }

  return (
    <PageContainer>
      <PageHero
        title="Contact"
        subtitle="Get in touch to discuss collaborations, community initiatives, or speaking engagements."
      />

      <SectionWrapper>
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

            {/* Left — contact details */}
            <div>
              <p className="eyebrow mb-4">Direct Contact</p>
              <h2 className="section-title mb-4" style={{ fontSize: '2rem' }}>Get in Touch</h2>
              <div className="gold-rule mb-8" />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
                {contactDetails.map(c => (
                  <a
                    key={c.label}
                    href={c.href}
                    target={c.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="card"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '1.25rem',
                      padding: '1.25rem 1.5rem', textDecoration: 'none',
                    }}
                  >
                    <div style={{
                      width: 44, height: 44, borderRadius: 8, flexShrink: 0,
                      background: 'var(--navy)', color: 'var(--gold)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {c.icon}
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold-dark)', marginBottom: 4 }}>
                        {c.label}
                      </p>
                      <p style={{ fontSize: '1.05rem', color: 'var(--navy)', fontWeight: 500 }}>{c.value}</p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Social row */}
              <div style={{
                background: 'var(--navy)', borderRadius: 12, padding: '2rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
                boxShadow: '0 2px 12px rgba(11,29,53,0.08)'
              }}>
                <div>
                  <p className="eyebrow mb-1" style={{ color: 'var(--gold)', opacity: 0.9 }}>Follow on Social Media</p>
                  <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)' }}>Stay updated with activities</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {[
                    { href: instagram, icon: <InstagramIcon />, label: 'Instagram' },
                    { href: facebook, icon: <FacebookIcon />, label: 'Facebook' },
                  ].map(s => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      style={{
                        width: 46, height: 46, borderRadius: '50%',
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: 'rgba(255,255,255,0.05)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'var(--gold)';
                        e.currentTarget.style.background = 'var(--gold)';
                        e.currentTarget.style.color = 'var(--navy)';
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                        e.currentTarget.style.color = '#fff';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <div style={{ transform: 'scale(1.2)' }}>{s.icon}</div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — form */}
            <div>
              <div style={{
                background: '#fff', borderRadius: 14, padding: '2.75rem',
                border: '1px solid rgba(201,168,76,0.15)',
                boxShadow: '0 4px 20px rgba(11,29,53,0.04)',
              }}>
                {sent ? (
                  <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                    <CheckCircle size={56} style={{ color: 'var(--gold)', margin: '0 auto 1.5rem' }} />
                    <h4 className="font-display font-bold" style={{ fontSize: '1.5rem', color: 'var(--navy)', marginBottom: '0.75rem' }}>
                      Message Sent
                    </h4>
                    <p style={{ fontSize: '1.05rem', color: 'var(--gray-mid)', marginBottom: '2rem' }}>
                      Thank you. Your message has been received.
                    </p>
                    <button onClick={() => setSent(false)} className="btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
                      Send Another
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="font-display font-bold" style={{ fontSize: '1.5rem', color: 'var(--navy)', marginBottom: '2rem' }}>
                      Send a Message
                    </h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Field label="Name" name="name" value={form.name} onChange={handleChange} placeholder="Full name" inputStyle={inputStyle} />
                        <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email address" inputStyle={inputStyle} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Field label="Phone (Optional)" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="Phone number" inputStyle={inputStyle} required={false} />
                        <Field label="Subject" name="subject" value={form.subject} onChange={handleChange} placeholder="Reason for contact" inputStyle={inputStyle} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--navy)', display: 'block', marginBottom: 8 }}>
                          Message <span style={{ color: 'var(--gold)' }}>*</span>
                        </label>
                        <textarea
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          required
                          rows={6}
                          placeholder="Write your message here…"
                          style={{ ...inputStyle, resize: 'none' }}
                          onFocus={e => { e.target.style.borderColor = 'var(--gold)'; e.target.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.1)'; }}
                          onBlur={e => { e.target.style.borderColor = 'rgba(11,29,53,0.15)'; e.target.style.boxShadow = 'none'; }}
                        />
                      </div>
                      <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ justifyContent: 'center', width: '100%', marginTop: 8, padding: '1rem', fontSize: '1.05rem', opacity: isSubmitting ? 0.7 : 1 }}>
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
                        ) : (
                          <><Send size={18} /> Send Message</>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </SectionWrapper>
    </PageContainer>
  )
})

export default Contact

function Field({ label, name, type = 'text', value, onChange, placeholder, inputStyle, required = true }) {
  return (
    <div>
      <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--navy)', display: 'block', marginBottom: 8 }}>
        {label} {required && <span style={{ color: 'var(--gold)' }}>*</span>}
      </label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder} required={required}
        style={inputStyle}
        onFocus={e => { e.target.style.borderColor = 'var(--gold)'; e.target.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.1)'; }}
        onBlur={e => { e.target.style.borderColor = 'rgba(11,29,53,0.15)'; e.target.style.boxShadow = 'none'; }}
      />
    </div>
  )
}
