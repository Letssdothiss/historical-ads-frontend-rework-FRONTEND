import { describe, expect, it } from 'vitest'
import {
  toAndel,
  toBarChartData,
  toChartData,
} from '../../utils/StatisticsTransformers'

const tableData = [
  { lan: 'Stockholms län', 2024: 100, 2025: 200 },
  { lan: 'Skåne län', 2024: 50, 2025: 50 },
]

describe('toBarChartData', () => {
  it('returns null for invalid input', () => {
    expect(toBarChartData(null)).toBeNull()
    expect(toBarChartData([])).toBeNull()
    expect(toBarChartData([null])).toBeNull()
  })

  it('returns null when fewer than two regions are present', () => {
    expect(toBarChartData([{ lan: 'Endast ett län', 2024: 10 }])).toBeNull()
  })

  it('builds bar chart series with regions on the x-axis', () => {
    const result = toBarChartData(tableData)

    expect(result).toMatchObject({
      title: 'Statistik',
      x: 'Område',
      y: 'Antal annonser',
      data: {
        xValueNames: ['Stockholms län', 'Skåne län'],
        series: [
          { title: '2024', yValues: [100, 50] },
          { title: '2025', yValues: [200, 50] },
        ],
      },
    })
    expect(result.data.xValues).toEqual([0, 1])
  })

  it('accepts custom labels via options', () => {
    const result = toBarChartData(tableData, {
      title: 'Test',
      xLabel: 'Region',
      yLabel: 'Antal',
    })

    expect(result.title).toBe('Test')
    expect(result.x).toBe('Region')
    expect(result.y).toBe('Antal')
  })

  it('ignores rows without lan', () => {
    const result = toBarChartData([
      { lan: 'A', 2024: 1, 2025: 2 },
      { 2024: 99, 2025: 99 },
      { lan: 'B', 2024: 3, 2025: 4 },
    ])

    expect(result.data.xValueNames).toEqual(['A', 'B'])
    expect(result.data.series[0].yValues).toEqual([1, 3])
  })
})

describe('toChartData', () => {
  it('returns null for invalid input', () => {
    expect(toChartData(null)).toBeNull()
    expect(toChartData([])).toBeNull()
  })

  it('returns null when fewer than two time periods exist', () => {
    expect(toChartData([{ lan: 'Skåne län', 2024: 100 }])).toBeNull()
  })

  it('builds line chart series with years on the x-axis', () => {
    const result = toChartData(tableData)

    expect(result).toMatchObject({
      title: 'Statistik',
      x: 'År',
      y: 'Antal annonser',
      data: {
        xValues: [2024, 2025],
        xValueNames: ['2024', '2025'],
        series: [
          { title: 'Stockholms län', yValues: [100, 200] },
          { title: 'Skåne län', yValues: [50, 50] },
        ],
      },
    })
  })

  it('uses positional x values for non-numeric year labels', () => {
    const result = toChartData([{ lan: 'Skåne län', Totalt: 80, Övrigt: 20 }])

    expect(result.data.xValues).toEqual([0, 1])
    expect(result.data.xValueNames).toEqual(['Totalt', 'Övrigt'])
  })

  it('coerces invalid cell values to zero', () => {
    const result = toChartData([
      { lan: 'A', 2024: null, 2025: 'x' },
      { lan: 'B', 2024: 10, 2025: 20 },
    ])

    expect(result.data.series[0].yValues).toEqual([0, 0])
  })
})

describe('toAndel', () => {
  it('gives each region its share of the grand total for a single year', () => {
    // The single-year regression: shares must be relative to the total across
    // regions, not 100% per row.
    const result = toAndel([
      { lan: 'Stockholms län', 2025: 300 },
      { lan: 'Skåne län', 2025: 100 },
    ])

    expect(result).toEqual([
      { lan: 'Stockholms län', 2025: 75 },
      { lan: 'Skåne län', 2025: 25 },
    ])
  })

  it('computes shares relative to the grand total across regions and years', () => {
    const result = toAndel([
      { lan: 'A', 2024: 100, 2025: 100 },
      { lan: 'B', 2024: 100, 2025: 100 },
    ])

    // Grand total 400 -> every cell is 25%.
    expect(result).toEqual([
      { lan: 'A', 2024: 25, 2025: 25 },
      { lan: 'B', 2024: 25, 2025: 25 },
    ])
  })

  it('returns zero shares when every count is zero', () => {
    const result = toAndel([{ lan: 'Tom rad', 2024: 0, 2025: 0 }])

    expect(result).toEqual([{ lan: 'Tom rad', 2024: 0, 2025: 0 }])
  })

  it('rounds shares to one decimal', () => {
    const result = toAndel([{ lan: 'A', 2024: 1, 2025: 2 }])

    expect(result[0]).toEqual({ lan: 'A', 2024: 33.3, 2025: 66.7 })
  })
})
