import { describe, expect, it } from 'vitest'
import {
  MAIN_TAB_PREFIXES,
  ROUTES,
  buildAdDetailPath,
  getMainTabSection,
} from '../../constants/routes'

describe('getMainTabSection', () => {
  it('returns the matching main tab prefix for nested paths', () => {
    expect(getMainTabSection('/platsannonser')).toBe(ROUTES.JOB_ADS)
    expect(getMainTabSection('/platsannonser/resultat')).toBe(ROUTES.JOB_ADS)
    expect(getMainTabSection('/statistik/resultat')).toBe(ROUTES.STATISTICS)
    expect(getMainTabSection('/om-datan')).toBe(ROUTES.ABOUT)
  })

  it('returns null for paths outside main tabs', () => {
    expect(getMainTabSection('/')).toBeNull()
    expect(getMainTabSection('/unknown')).toBeNull()
  })

  it('lists the three main tab prefixes', () => {
    expect(MAIN_TAB_PREFIXES).toEqual([
      ROUTES.JOB_ADS,
      ROUTES.STATISTICS,
      ROUTES.ABOUT,
    ])
  })
})

describe('buildAdDetailPath', () => {
  it('builds an encoded detail path from ad id', () => {
    expect(buildAdDetailPath('abc-123')).toBe('/platsannonser/annons/abc-123')
    expect(buildAdDetailPath('id/with space')).toBe(
      '/platsannonser/annons/id%2Fwith%20space',
    )
  })
})
