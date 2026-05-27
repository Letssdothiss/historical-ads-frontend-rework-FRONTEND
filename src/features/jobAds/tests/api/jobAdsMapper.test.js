import { describe, expect, it } from 'vitest'
import { mapHitToAd, mapSearchResponse } from '../../api/jobAdsMapper'

describe('mapHitToAd', () => {
  it('returns null for falsy hit', () => {
    expect(mapHitToAd(null)).toBeNull()
    expect(mapHitToAd(undefined)).toBeNull()
  })

  it('maps nested _source shape from API', () => {
    const ad = mapHitToAd({
      _id: 'ad-1',
      _source: {
        headline: 'Mjukvaruutvecklare',
        employer: { name: 'Test AB' },
        occupation: { label: 'Utvecklare' },
        workplace_address: {
          municipality: 'Stockholm',
          region: 'Stockholms län',
        },
        publication_date: '2024-01-15',
        employment_type: { label: 'Tillsvidare' },
        number_of_vacancies: 2,
        webpage_url: 'https://example.com/ad/1',
      },
    })

    expect(ad).toMatchObject({
      id: 'ad-1',
      title: 'Mjukvaruutvecklare',
      employer: 'Test AB',
      occupation: 'Utvecklare',
      municipality: 'Stockholm',
      region: 'Stockholms län',
      employmentType: 'Tillsvidare',
      numberOfPositions: 2,
      externalUrl: 'https://example.com/ad/1',
    })
    expect(ad.publishedAt).toBeTruthy()
  })

  it('falls back to defaults when fields are missing', () => {
    const ad = mapHitToAd({ _id: 'x', _source: {} })

    expect(ad.title).toBe('Okänd titel')
    expect(ad.employer).toBe('–')
    expect(ad.numberOfPositions).toBe(1)
  })

  it('maps flat hit shape without _source', () => {
    const ad = mapHitToAd({
      id: 'flat-1',
      original_id: '30429400',
      title: 'Platschef',
      employer_name: 'Bygg AB',
      occupation_group: { label: 'Chefer' },
      municipality: { label: 'Göteborg' },
      region: { label: 'Västra Götalands län' },
      external_url: 'https://example.com/flat',
    })

    expect(ad).toMatchObject({
      id: 'flat-1',
      originalId: '30429400',
      title: 'Platschef',
      employer: 'Bygg AB',
      occupation: 'Chefer',
      municipality: 'Göteborg',
      region: 'Västra Götalands län',
      externalUrl: 'https://example.com/flat',
    })
    expect(ad.raw).toEqual(expect.objectContaining({ title: 'Platschef' }))
  })

  it('uses occupation label as title when headline is missing', () => {
    const ad = mapHitToAd({
      _id: 'ad-2',
      _source: { occupation: { label: 'Sjuksköterska' } },
    })

    expect(ad.title).toBe('Sjuksköterska')
  })

  it('maps camelCase originalId from API responses', () => {
    const ad = mapHitToAd({
      id: 'flat-2',
      originalId: '30429400',
      title: 'Undersköterska',
    })

    expect(ad.originalId).toBe('30429400')
  })
})

describe('mapSearchResponse', () => {
  it('returns empty result for falsy response', () => {
    expect(mapSearchResponse(null)).toEqual({ ads: [], total: 0, offset: 0 })
  })

  it('maps hits and totals from API response', () => {
    const result = mapSearchResponse({
      hits: [
        { _id: '1', _source: { headline: 'A' } },
        { _id: '2', _source: { headline: 'B' } },
      ],
      result_count: 42,
      offset: 20,
    })

    expect(result.ads).toHaveLength(2)
    expect(result.total).toBe(42)
    expect(result.offset).toBe(20)
    expect(result.ads[0].title).toBe('A')
  })

  it('falls back to total and ads.length when result_count is missing', () => {
    const fromTotal = mapSearchResponse({
      hits: [{ _id: '1', _source: { headline: 'A' } }],
      total: 99,
    })
    expect(fromTotal.total).toBe(99)

    const fromLength = mapSearchResponse({
      hits: [
        { _id: '1', _source: { headline: 'A' } },
        { _id: '2', _source: { headline: 'B' } },
      ],
    })
    expect(fromLength.total).toBe(2)
  })

  it('filters out invalid hits', () => {
    const result = mapSearchResponse({
      hits: [null, { _id: '1', _source: { headline: 'A' } }],
      result_count: 1,
    })

    expect(result.ads).toHaveLength(1)
    expect(result.ads[0].title).toBe('A')
  })
})
