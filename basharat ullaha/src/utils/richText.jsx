import React from 'react'

/**
 * Parses markdown-like rich text syntax safely to prevent XSS.
 * Supports:
 * - **bold** -> <strong>bold</strong>
 * - ==highlight== -> <span style="color: var(--gold); font-weight: 600;">highlight</span>
 * - \n -> <br />
 */
export function parseRichText(text) {
  if (!text) return ''

  // Escape HTML to prevent XSS
  let escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

  // Replace ==text== with gold span
  escaped = escaped.replace(/==(.*?)==/g, '<span class="gold-highlight" style="color: var(--gold); font-weight: 600;">$1</span>')

  // Replace **text** with strong
  escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

  // Replace newlines with <br /> to preserve multiline formatting
  escaped = escaped.replace(/\n/g, '<br />')

  return <span dangerouslySetInnerHTML={{ __html: escaped }} />
}
