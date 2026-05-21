import { describe, expect, it } from 'vitest'
import { formatShortDate } from '../../utils/Date'

describe('formatShortDate', () => {
  it('returns empty string for falsy input', () => {
    expect(formatShortDate(null)).toBe('')
    expect(formatShortDate(undefined)).toBe('')
    expect(formatShortDate('')).toBe('')
  })

  it('formats a valid date in Swedish short style', () => {
    const formatted = formatShortDate('2024-01-15')

    expect(formatted).toMatch(/15/)
    expect(formatted.toLowerCase()).toMatch(/jan/)
  })

  it('returns the original string when parsing fails', () => {
    expect(formatShortDate('not-a-date')).toBe('not-a-date')
  })
})
