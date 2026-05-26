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
              id: 'field-it',
              preferred_label: 'IT',
              narrower: [
                { id: 'grp-dev', preferred_label: 'Utvecklare' },
                { id: 'grp-test', preferred_label: 'Testare' },
              ],
            },
            {
              id: 'field-halsa',
              preferred_label: 'Hälsa',
              narrower: [
                { id: 'grp-sjuksk', preferred_label: 'Sjuksköterska' },
              ],
            },
          ],
        },
      }),
    })

    const { result } = renderHook(() => useJobData())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBeNull()
    expect(result.current.jobData).toEqual({
      IT: {
        id: 'field-it',
        groups: [
          { id: 'grp-test', label: 'Testare' },
          { id: 'grp-dev', label: 'Utvecklare' },
        ],
      },
      Hälsa: {
        id: 'field-halsa',
        groups: [{ id: 'grp-sjuksk', label: 'Sjuksköterska' }],
      },
    })
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('taxonomy.api.jobtechdev.se'),
    )
  })

  it('sets error when the taxonomy request fails', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false })

    const { result } = renderHook(() => useJobData())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe('Something went wrong fetching job data')
    expect(result.current.jobData).toEqual({})
  })

  it('sets error message when fetch throws', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Nätverksfel'))

    const { result } = renderHook(() => useJobData())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe('Nätverksfel')
  })
})
