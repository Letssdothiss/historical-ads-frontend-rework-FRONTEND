import { describe, expect, it } from 'vitest'
import {
  formatEmployerSearchLabel,
  formatResultCount,
} from '../../utils/JobAdsFormatters'

describe('formatResultCount', () => {
  it('returns empty string for null or undefined', () => {
    expect(formatResultCount(null)).toBe('')
    expect(formatResultCount(undefined)).toBe('')
  })

  it('formats total with Swedish locale grouping', () => {
    expect(formatResultCount(1234)).toBe('1\u00a0234 annonser')
  })
})

describe('formatEmployerSearchLabel', () => {
  it('returns Organisationsnummer for org_number', () => {
    expect(formatEmployerSearchLabel('org_number')).toBe('Organisationsnummer')
  })

  it('returns Namn for other types', () => {
    expect(formatEmployerSearchLabel('name')).toBe('Namn')
    expect(formatEmployerSearchLabel(undefined)).toBe('Namn')
  })
})
