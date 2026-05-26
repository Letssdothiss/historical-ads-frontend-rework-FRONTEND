import { describe, expect, it } from 'vitest'
import { parseMonthNumbers } from '../../utils/monthLabels'

describe('parseMonthNumbers', () => {
  it('parses numeric month strings', () => {
    expect(parseMonthNumbers(['3', '6'])).toEqual([3, 6])
  })

  it('parses Swedish month names from the time period filter', () => {
    expect(parseMonthNumbers(['Mars', 'Juni', 'December'])).toEqual([3, 6, 12])
  })
})
