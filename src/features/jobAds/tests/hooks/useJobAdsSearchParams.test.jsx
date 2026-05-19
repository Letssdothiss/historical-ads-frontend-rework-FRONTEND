import { describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { useJobAdsSearchParams } from '../../hooks/useJobAdsSeachParams'

function createWrapper(initialPath = '/platsannonser') {
  return function Wrapper({ children }) {
    return (
      <MemoryRouter initialEntries={[initialPath]}>{children}</MemoryRouter>
    )
  }
}

function usePathname() {
  return useLocation().pathname + useLocation().search
}

describe('useJobAdsSearchParams', () => {
  it('reads filter values from URL search params', () => {
    const path =
      '/platsannonser?lan=Stockholms+l%C3%A4n&kommun=Stockholm&q=javascript&korkort=required'

    const { result } = renderHook(
      () => ({
        params: useJobAdsSearchParams(),
        path: usePathname(),
      }),
      { wrapper: createWrapper(path) },
    )

    expect(result.current.params.lan).toEqual(['Stockholms län'])
    expect(result.current.params.kommuner).toEqual(['Stockholm'])
    expect(result.current.params.fritext).toBe('javascript')
    expect(result.current.params.korkort).toBe('required')
  })

  it('setFreetext updates q in the URL', () => {
    const { result } = renderHook(
      () => ({
        params: useJobAdsSearchParams(),
        path: usePathname(),
      }),
      { wrapper: createWrapper('/platsannonser') },
    )

    act(() => {
      result.current.params.setFreetext('react')
    })

    expect(result.current.params.fritext).toBe('react')
    expect(result.current.path).toContain('q=react')
  })

  it('clearAll removes query parameters', () => {
    const { result } = renderHook(
      () => ({
        params: useJobAdsSearchParams(),
        path: usePathname(),
      }),
      { wrapper: createWrapper('/platsannonser?q=test&lan=A') },
    )

    act(() => {
      result.current.params.clearAll()
    })

    expect(result.current.params.fritext).toBe('')
    expect(result.current.params.lan).toEqual([])
    expect(result.current.path).not.toContain('q=')
  })

  it('setGeographyFilter replaces lan and kommun', () => {
    const { result } = renderHook(
      () => ({
        params: useJobAdsSearchParams(),
        path: usePathname(),
      }),
      { wrapper: createWrapper('/platsannonser?lan=Gammal') },
    )

    act(() => {
      result.current.params.setGeographyFilter({
        lan: ['Skåne län'],
        kommuner: ['Malmö'],
      })
    })

    expect(result.current.params.lan).toEqual(['Skåne län'])
    expect(result.current.params.kommuner).toEqual(['Malmö'])
    expect(result.current.path).not.toContain('Gammal')
  })
})
