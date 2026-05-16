/**
 * useSEO — Lightweight SEO head manager.
 * Updates document.title + all critical meta tags without any external library.
 * Call once at the top of each page component.
 */
import { useEffect } from 'react'

const SITE_NAME = 'Mohd Basharath Ullah'
const BASE_URL  = 'https://mohdbasharathullah.com'
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`
const DEFAULT_DESCRIPTION = 'Official digital portfolio of Mohd Basharath Ullah — Social Activist, Humanitarian Leader & Human Rights Advocate dedicated to Justice, Equality and Public Welfare.'

function setMeta(name, content, attr = 'name') {
  if (!content) return
  let el = document.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function setJsonLd(id, data) {
  let el = document.querySelector(`script[data-seo="${id}"]`)
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.setAttribute('data-seo', id)
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

/**
 * @param {object} opts
 * @param {string} opts.title      - Page-specific title (will be suffixed with site name)
 * @param {string} opts.description
 * @param {string} opts.canonical  - Path e.g. '/about'
 * @param {string} [opts.image]    - Absolute OG image URL
 * @param {string} [opts.type]     - OG type (default 'website')
 * @param {object} [opts.schema]   - Additional JSON-LD object to inject
 */
export function useSEO({ title, description, canonical = '/', image, type = 'website', schema } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Humanitarian Leader & Social Activist`
    const desc      = description || DEFAULT_DESCRIPTION
    const ogImage   = image || DEFAULT_IMAGE
    const url       = `${BASE_URL}${canonical}`

    // Document title
    document.title = fullTitle

    // Standard meta
    setMeta('description',        desc)
    setMeta('author',             SITE_NAME)
    setMeta('robots',             'index, follow, max-image-preview:large')
    setMeta('theme-color',        '#0b1d35')

    // Canonical link
    setLink('canonical', url)

    // Open Graph
    setMeta('og:type',            type,      'property')
    setMeta('og:title',           fullTitle, 'property')
    setMeta('og:description',     desc,      'property')
    setMeta('og:url',             url,       'property')
    setMeta('og:image',           ogImage,   'property')
    setMeta('og:image:alt',       fullTitle, 'property')
    setMeta('og:site_name',       SITE_NAME, 'property')
    setMeta('og:locale',          'en_IN',   'property')

    // Twitter Card
    setMeta('twitter:card',        'summary_large_image')
    setMeta('twitter:title',       fullTitle)
    setMeta('twitter:description', desc)
    setMeta('twitter:image',       ogImage)

    // Base JSON-LD Person + Website schema (on every page)
    setJsonLd('person', {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: SITE_NAME,
      url: BASE_URL,
      jobTitle: 'Social Activist & Humanitarian Leader',
      description: DEFAULT_DESCRIPTION,
      image: DEFAULT_IMAGE,
      sameAs: [
        'https://www.instagram.com/mohd.basharath.96',
        'https://www.facebook.com/share/r/14btibmxfRQ/'
      ],
      worksFor: {
        '@type': 'Organization',
        name: 'International Human Rights & Social Justice Organization'
      }
    })

    setJsonLd('website', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: BASE_URL,
      description: DEFAULT_DESCRIPTION,
    })

    // Page-specific additional schema
    if (schema) {
      setJsonLd('page-schema', schema)
    }
  }, [title, description, canonical, image, type, schema])
}
