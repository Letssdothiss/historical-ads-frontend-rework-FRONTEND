import { describe, expect, it } from 'vitest'
import { buildQueryString } from '../../utils/QueryString'

describe('buildQueryString', () => {
  it('returns empty string for empty params', () => {
    expect(buildQueryString()).toBe('')
    expect(buildQueryString({})).toBe('')
  })

  it('serializes scalar values', () => {
    expect(buildQueryString({ q: 'react', offset: 0 })).toBe('q=react&offset=0')
  })

  it('serializes arrays as repeated keys', () => {
    const qs = buildQueryString({
      lan: ['Stockholms län', 'Skåne län'],
    })

    expect(qs).toContain('lan=Stockholms')
    expect(qs).toContain('lan=Sk%C3%A5ne')
  })

  it('skips null, undefined, and empty values', () => {
    const qs = buildQueryString({
      q: '',
      lan: ['', 'Skåne län'],
      unused: undefined,
      removed: null,
    })

    expect(qs).toBe('lan=Sk%C3%A5ne+l%C3%A4n')
    expect(qs).not.toContain('q=')
    expect(qs).not.toContain('unused')
  })
})
