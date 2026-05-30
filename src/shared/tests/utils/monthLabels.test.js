import { describe, expect, it } from 'vitest'
import {
  buildPublishedDateRange,
  formatPeriodLabel,
  parseMonthNumbers,
} from '../../utils/monthLabels'

describe('parseMonthNumbers', () => {
  it('parses numeric month strings', () => {
    expect(parseMonthNumbers(['3', '6'])).toEqual([3, 6])
  })

  it('parses Swedish month names from the time period filter', () => {
    expect(parseMonthNumbers(['Mars', 'Juni', 'December'])).toEqual([3, 6, 12])
  })
})

describe('buildPublishedDateRange', () => {
  it('returns null when nothing is selected', () => {
    expect(buildPublishedDateRange([], [])).toBeNull()
  })

  it('restricts a single year-qualified month to exactly that month', () => {
    expect(buildPublishedDateRange(['2026'], ['2026-01'])).toEqual({
      after: '2026-01-01',
      before: '2026-01-31',
    })
  })

  it('falls back to the whole year when no month is selected', () => {
    expect(buildPublishedDateRange(['2026'], [])).toEqual({
      after: '2026-01-01',
      before: '2026-12-31',
    })
  })

  it('collapses disjoint cross-year months to the tightest covering range', () => {
    // Dec 2025 + Jan 2026 — must not balloon to two full years.
    expect(
      buildPublishedDateRange(['2025', '2026'], ['2025-12', '2026-01']),
    ).toEqual({ after: '2025-12-01', before: '2026-01-31' })
  })

  it('still filters when months carry the year but years is empty', () => {
    expect(buildPublishedDateRange([], ['2026-01'])).toEqual({
      after: '2026-01-01',
      before: '2026-01-31',
    })
  })

  it('applies legacy bare month names to every selected year', () => {
    expect(buildPublishedDateRange(['2024'], ['Januari', 'Mars'])).toEqual({
      after: '2024-01-01',
      before: '2024-03-31',
    })
  })
})

describe('formatPeriodLabel', () => {
  it('returns empty string when nothing is selected', () => {
    expect(formatPeriodLabel([], [])).toBe('')
  })

  it('shows the bare year when no month is selected', () => {
    expect(formatPeriodLabel(['2025'], [])).toBe('2025')
  })

  it('prepends the selected month to its year', () => {
    expect(formatPeriodLabel(['2025'], ['2025-01'])).toBe('Januari 2025')
  })

  it('lists several months for the same year', () => {
    expect(formatPeriodLabel(['2025'], ['2025-03', '2025-01'])).toBe(
      'Januari, Mars 2025',
    )
  })

  it('separates multiple years', () => {
    expect(formatPeriodLabel(['2024', '2025'], ['2025-01'])).toBe(
      '2024 — Januari 2025',
    )
  })
})
