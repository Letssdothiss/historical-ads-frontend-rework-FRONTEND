import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useGeographyData } from '../../hooks/useGeographyData'

describe('useGeographyData', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('maps region concepts to län and sorted municipalities', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          concepts: [
            {
              id: 'lan-stockholm',
              preferred_label: 'Stockholms län',
              narrower: [
                { id: 'k-stockholm', preferred_label: 'Stockholm' },
                { id: 'k-nacka', preferred_label: 'Nacka' },
              ],
            },
            {
              id: 'lan-skane',
              preferred_label: 'Skåne län',
              narrower: [{ id: 'k-malmo', preferred_label: 'Malmö' }],
            },
            {
              id: 'country-se',
              preferred_label: 'Sverige',
              narrower: [{ id: 'k-ignored', preferred_label: 'Ignored' }],
            },
          ],
        },
      }),
    })

    const { result } = renderHook(() => useGeographyData())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBeNull()
    expect(result.current.lanData).toEqual({
      'Stockholms län': {
        id: 'lan-stockholm',
        kommuner: [
          { id: 'k-nacka', label: 'Nacka' },
          { id: 'k-stockholm', label: 'Stockholm' },
        ],
      },
      'Skåne län': {
        id: 'lan-skane',
        kommuner: [{ id: 'k-malmo', label: 'Malmö' }],
      },
    })
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('taxonomy.api.jobtechdev.se'),
    )
  })

  it('sets error when the taxonomy request fails', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false })

    const { result } = renderHook(() => useGeographyData())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe(
      'Something went wrong while fetching geography',
    )
    expect(result.current.lanData).toEqual({})
  })

  it('sets error message when fetch throws', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Nätverksfel'))

    const { result } = renderHook(() => useGeographyData())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe('Nätverksfel')
  })
})
