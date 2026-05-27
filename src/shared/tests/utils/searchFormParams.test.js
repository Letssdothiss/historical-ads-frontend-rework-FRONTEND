import { describe, expect, it } from 'vitest'
import {
  parseJobAdsSearchFormState,
  parseStatisticsSearchFormState,
} from '../../utils/searchFormParams'

describe('parseJobAdsSearchFormState', () => {
  it('returns empty defaults when URL has no params', () => {
    const state = parseJobAdsSearchFormState(new URLSearchParams())
    expect(state.q).toBe('')
    expect(state.geography.kommuner).toEqual([])
    expect(state.employerType).toBe('name')
  })

  it('restores text, employer, filters and label groups from URL', () => {
    const params = new URLSearchParams()
    params.set('q', 'react')
    params.set('employer', 'Acme AB')
    params.append('kommun', 'k-stockholm')
    params.set('kommun-labels', JSON.stringify({ 'Stockholms län': ['Stockholm'] }))
    params.append('yrkesgrupp', 'g-dev')
    params.set(
      'yrkesgrupp-labels',
      JSON.stringify({ 'Data/IT': ['Utvecklare'] }),
    )
    params.append('years', '2024')
    params.append('employment_type', 'permanent')
    params.append('skills', 'JavaScript')
    params.append('skills', 'React')

    const state = parseJobAdsSearchFormState(params)

    expect(state.q).toBe('react')
    expect(state.employer).toBe('Acme AB')
    expect(state.geography.kommuner).toEqual(['k-stockholm'])
    expect(state.geography.grouped).toEqual({ 'Stockholms län': ['Stockholm'] })
    expect(state.geography.lan).toEqual(['Stockholms län'])
    expect(state.occupations.groups).toEqual(['g-dev'])
    expect(state.timePeriod.years).toEqual(['2024'])
    expect(state.employment.type).toEqual(['permanent'])
    expect(state.skills).toBe('JavaScript, React')
  })

  it('uses organization number employer type when present', () => {
    const params = new URLSearchParams()
    params.set('organization_number', '556677-8899')

    expect(parseJobAdsSearchFormState(params).employerType).toBe('org')
    expect(parseJobAdsSearchFormState(params).organizationNumber).toBe(
      '556677-8899',
    )
  })
})

describe('parseStatisticsSearchFormState', () => {
  it('restores trend and driving license from URL', () => {
    const params = new URLSearchParams()
    params.set('q', 'test')
    params.set('trend', 'top5_skills')
    params.set('korkort', 'required')

    const state = parseStatisticsSearchFormState(params)

    expect(state.q).toBe('test')
    expect(state.trend).toBe('top5_skills')
    expect(state.drivingLicense).toBe('required')
  })
})
