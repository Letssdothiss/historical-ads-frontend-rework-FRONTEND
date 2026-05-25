// Formats a date string to a short format (e.g., "12 Jan") using the Swedish locale.
export function formatShortDate(dateString) {
  if (!dateString) return ''
  try {
    return new Intl.DateTimeFormat('sv-SE', {
      day: 'numeric',
      month: 'short',
    }).format(new Date(dateString))
  } catch {
    return dateString
  }
}
