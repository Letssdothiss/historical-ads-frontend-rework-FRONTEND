import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useJobData } from '../../hooks/useJobData'

describe('useJobData', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('maps taxonomy concepts into sorted job groups per area', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          concepts: [
            {
              preferred_label: 'IT',
              narrower: [
                { preferred_label: 'Utvecklare' },
                { preferred_label: 'Testare' },
              ],
            },
            {
              preferred_label: 'Hälsa',
              narrower: [{ preferred_label: 'Sjuksköterska' }],
            },
          ],
        },
      }),
    })

    const { result } = renderHook(() => useJobData())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBeNull()
    expect(result.current.jobData).toEqual({
      IT: ['Testare', 'Utvecklare'],
      Hälsa: ['Sjuksköterska'],
    })
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('taxonomy.api.jobtechdev.se'),
    )
  })

  it('sets error when the taxonomy request fails', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false })

    const { result } = renderHook(() => useJobData())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe('Något gick fel vid hämtning av yrkesdata')
    expect(result.current.jobData).toEqual({})
  })

  it('sets error message when fetch throws', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Nätverksfel'))

    const { result } = renderHook(() => useJobData())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe('Nätverksfel')
  })
})
