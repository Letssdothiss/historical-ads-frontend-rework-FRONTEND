import { describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { useStatisticsParams } from '../../hooks/UseStatisticsParams'

function createWrapper(initialPath = '/statistik') {
  return function Wrapper({ children }) {
    return (
      <MemoryRouter initialEntries={[initialPath]}>{children}</MemoryRouter>
    )
  }
}

function useSearchString() {
  return useLocation().search
}

describe('useStatisticsParams', () => {
  it('reads statistics params from the URL', () => {
    const path =
      '/statistik?lan=Sk%C3%A5ne+l%C3%A4n&ar=2024&ar=2025&yrkesgrupp=Utvecklare&kompetens=react'

    const { result } = renderHook(
      () => ({
        hook: useStatisticsParams(),
        search: useSearchString(),
      }),
      { wrapper: createWrapper(path) },
    )

    expect(result.current.hook.params).toEqual({
      lan: ['Skåne län'],
      ar: ['2024', '2025'],
      yrkesgrupp: ['Utvecklare'],
      kompetens: 'react',
    })
    expect(result.current.hook.hasParams).toBe(true)
  })

  it('reports hasParams false when the URL has no filters', () => {
    const { result } = renderHook(() => useStatisticsParams(), {
      wrapper: createWrapper('/statistik'),
    })

    expect(result.current.hasParams).toBe(false)
    expect(result.current.params.kompetens).toBe('')
  })

  it('setParams replaces the query string', () => {
    const { result } = renderHook(
      () => ({
        hook: useStatisticsParams(),
        search: useSearchString(),
      }),
      { wrapper: createWrapper('/statistik?lan=Gammal') },
    )

    act(() => {
      result.current.hook.setParams({
        lan: ['Stockholms län'],
        ar: ['2024'],
        kompetens: 'data',
      })
    })

    expect(result.current.hook.params.lan).toEqual(['Stockholms län'])
    expect(result.current.hook.params.ar).toEqual(['2024'])
    expect(result.current.hook.params.kompetens).toBe('data')
    expect(result.current.search).toContain('lan=Stockholms')
    expect(result.current.search).not.toContain('Gammal')
  })
})
