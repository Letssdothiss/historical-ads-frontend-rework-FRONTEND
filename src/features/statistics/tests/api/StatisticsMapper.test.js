import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  mapStatisticsByMonth,
  mapStatisticsResponse,
} from '../../api/StatisticsMapper'

describe('mapStatisticsResponse', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'table').mockImplementation(() => {})
  })

  it('returns empty array for invalid input', () => {
    expect(mapStatisticsResponse(null)).toEqual([])
    expect(mapStatisticsResponse([])).toEqual([])
  })

  it('maps region stats per year into table rows', () => {
    const result = mapStatisticsResponse([
      {
        year: '2024',
        raw: {
          stats: {
            region: [{ label: 'Stockholms län', occurrences: 100 }],
          },
        },
      },
      {
        year: '2025',
        raw: {
          stats: {
            region: [{ label: 'Stockholms län', occurrences: 150 }],
          },
        },
      },
    ])

    expect(result).toEqual([{ lan: 'Stockholms län', 2024: 100, 2025: 150 }])
  })

  it('supports direct region array on raw response', () => {
    const result = mapStatisticsResponse([
      {
        year: '2024',
        raw: {
          region: [{ label: 'Skåne län', occurrences: 42 }],
        },
      },
    ])

    expect(result).toEqual([{ lan: 'Skåne län', 2024: 42 }])
  })

  it('skips year results with error payloads', () => {
    const result = mapStatisticsResponse([
      { year: '2024', raw: { error: 'Backendfel' } },
      {
        year: '2025',
        raw: { stats: { region: [{ label: 'Skåne län', occurrences: 10 }] } },
      },
    ])

    expect(result).toEqual([{ lan: 'Skåne län', 2025: 10 }])
  })
})

describe('mapStatisticsByMonth', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  it('returns empty array for invalid input', () => {
    expect(mapStatisticsByMonth(null)).toEqual([])
    expect(mapStatisticsByMonth([])).toEqual([])
  })

  it('maps month labels across years', () => {
    const result = mapStatisticsByMonth([
      {
        year: '2024',
        raw: {
          stats: {
            month: [
              { label: '2024-01', occurrences: 10 },
              { label: '2024-02', occurrences: 20 },
            ],
          },
        },
      },
      {
        year: '2025',
        raw: {
          stats: {
            month: [{ label: '2025-01', occurrences: 15 }],
          },
        },
      },
    ])

    expect(result).toEqual([
      { lan: 'Januari', 2024: 10, 2025: 15 },
      { lan: 'Februari', 2024: 20 },
    ])
  })

  it('skips year results with error payloads', () => {
    const result = mapStatisticsByMonth([
      { year: '2024', raw: { error: 'Backendfel' } },
      {
        year: '2025',
        raw: { month: [{ label: '01', occurrences: 5 }] },
      },
    ])

    expect(result).toEqual([{ lan: 'Januari', 2025: 5 }])
  })
})
