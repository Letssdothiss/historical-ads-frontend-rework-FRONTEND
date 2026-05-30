import { beforeEach, describe, expect, it, vi } from 'vitest'
import { exportStatistics, fetchStatistics } from '../../api/StatisticsApi'

const getMock = vi.fn()
const getFileMock = vi.fn()

vi.mock('../../../../shared/api/HttpClient', () => ({
  default: {},
  get: (...args) => getMock(...args),
  getFile: (...args) => getFileMock(...args),
}))

describe('fetchStatistics', () => {
  beforeEach(() => {
    getMock.mockReset()
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  it('fetches total stats when no years are selected', async () => {
    const raw = { stats: { region: [{ label: 'Skåne län', occurrences: 50 }] } }
    getMock.mockResolvedValue(raw)

    const result = await fetchStatistics({
      q: 'react',
      municipality: ['k-malmo'],
    })

    expect(getMock).toHaveBeenCalledWith('/stats', {
      q: 'react',
      municipality: ['k-malmo'],
    })
    expect(result).toEqual([{ year: 'Totalt', raw }])
  })

  it('prefers kompetens over q in API params', async () => {
    getMock.mockResolvedValue({})

    await fetchStatistics({ kompetens: 'java', q: 'ignored' })

    expect(getMock).toHaveBeenCalledWith('/stats', { q: 'java' })
  })

  it('maps yrkesgrupp and lan fallbacks to API field names', async () => {
    getMock.mockResolvedValue({})

    await fetchStatistics({
      yrkesgrupp: ['grp-dev'],
      municipality: ['k-goteborg'],
      driving_license_required: true,
    })

    expect(getMock).toHaveBeenCalledWith('/stats', {
      occupation_group: ['grp-dev'],
      municipality: ['k-goteborg'],
      driving_license_required: true,
    })
  })

  it('forwards employment facts: expands type tokens, sets abroad, renames scope', async () => {
    getMock.mockResolvedValue({})

    await fetchStatistics({
      employment_type: ['kpPX_CNN_gDU,sTu5_NBQ_udq', 'abroad'],
      duration: ['a7uU_j21_mkL'],
      working_hours_type: ['6YE1_gAC_R2G'],
    })

    expect(getMock).toHaveBeenCalledWith('/stats', {
      employment_type: ['kpPX_CNN_gDU', 'sTu5_NBQ_udq'],
      abroad: true,
      duration: ['a7uU_j21_mkL'],
      worktime_extent: ['6YE1_gAC_R2G'],
    })
  })

  it('fetches year_region aggregate when years are selected', async () => {
    const raw = {
      stats_by_year: {
        2024: {
          region: [{ label: 'Skåne län', occurrences: 100 }],
          month: [{ label: '2024-01', occurrences: 10 }],
        },
        2025: {
          region: [{ label: 'Skåne län', occurrences: 120 }],
          month: [],
        },
      },
    }
    getMock.mockResolvedValue(raw)

    const result = await fetchStatistics({ ar: ['2024', '2025'], q: 'test' })

    expect(getMock).toHaveBeenCalledWith('/stats', {
      q: 'test',
      aggregate: 'year_region',
      years: '2024,2025',
    })
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      year: '2024',
      raw: {
        stats: {
          region: [{ label: 'Skåne län', occurrences: 100 }],
          month: [{ label: '2024-01', occurrences: 10 }],
        },
      },
    })
    expect(result[1].year).toBe('2025')
  })

  it('forwards trend and forces the aggregate path, reading years from the response', async () => {
    const raw = {
      trend: 'top5_growing',
      trend_supported: true,
      stats_by_year: {
        2023: { region: [{ label: 'Utvecklare', occurrences: 10 }], month: [] },
        2024: { region: [{ label: 'Utvecklare', occurrences: 40 }], month: [] },
      },
    }
    getMock.mockResolvedValue(raw)

    const result = await fetchStatistics({
      trend: 'top5_growing',
      municipality: ['k-kalmar'],
    })

    expect(getMock).toHaveBeenCalledWith('/stats', {
      municipality: ['k-kalmar'],
      trend: 'top5_growing',
      aggregate: 'year_region',
    })
    expect(result.map((r) => r.year)).toEqual(['2023', '2024'])
  })

  it('falls back to Totalt when stats_by_year is missing', async () => {
    const raw = { stats: { region: [] } }
    getMock.mockResolvedValue(raw)

    const result = await fetchStatistics({ ar: ['2024'] })

    expect(result).toEqual([{ year: 'Totalt', raw }])
  })
})

describe('exportStatistics', () => {
  const clickMock = vi.fn()

  beforeEach(() => {
    getFileMock.mockReset()
    getFileMock.mockResolvedValue({
      blob: new Blob(['data']),
      contentType: 'text/csv',
    })

    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => {})
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => {})
    vi.spyOn(document, 'createElement').mockReturnValue({
      href: '',
      download: '',
      click: clickMock,
      remove: vi.fn(),
    })
  })

  it('exports with mapped params and year date range', async () => {
    await exportStatistics(
      {
        ar: ['2023', '2025'],
        kompetens: 'react',
        municipality: ['k-stockholm'],
      },
      'csv',
    )

    expect(getFileMock).toHaveBeenCalledWith('/export', {
      q: 'react',
      municipality: ['k-stockholm'],
      format: 'csv',
      published_after: '2023-01-01',
      published_before: '2025-12-31',
    })
    expect(clickMock).toHaveBeenCalledOnce()
  })
})
