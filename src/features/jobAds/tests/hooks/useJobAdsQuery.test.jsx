import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import { jobAdsApi } from '../../api/jobAdsApi'
import { useJobAdsQuery } from '../../hooks/useJobAdsQuery'
import { PAGE_SIZE } from '../../../../shared/constants/ui'

vi.mock('../../api/jobAdsApi', () => ({
  jobAdsApi: { search: vi.fn() },
}))

const searchMock = vi.mocked(jobAdsApi.search)

describe('useJobAdsQuery', () => {
  beforeEach(() => {
    searchMock.mockReset()
    searchMock.mockResolvedValue({
      hits: [{ _id: '1', _source: { headline: 'Testannons' } }],
      result_count: 1,
      offset: 0,
    })
  })

  it('fetches and maps search results', async () => {
    const uiParams = { q: 'react' }
    const { result } = renderHook(() => useJobAdsQuery(uiParams))

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(searchMock).toHaveBeenCalledWith({
      offset: 0,
      limit: PAGE_SIZE,
      q: 'react',
    })
    expect(result.current.ads).toHaveLength(1)
    expect(result.current.total).toBe(1)
    expect(result.current.isError).toBe(false)
  })

  it('maps UI filters to API params', async () => {
    const uiParams = {
      q: 'java',
      kommuner: ['k-malmo'],
      yrkesgrupper: ['grp-dev'],
      korkort: 'required',
      skills: ['React'],
    }

    renderHook(() => useJobAdsQuery(uiParams))

    await waitFor(() => expect(searchMock).toHaveBeenCalled())

    expect(searchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        q: 'java',
        municipality: ['k-malmo'],
        occupation_group: ['grp-dev'],
        driving_license_required: true,
        skills: ['React'],
      }),
    )
  })

  it('builds published date range from years and months', async () => {
    const uiParams = { years: ['2020', '2022'], months: ['3', '6'] }

    renderHook(() => useJobAdsQuery(uiParams))

    await waitFor(() => expect(searchMock).toHaveBeenCalled())

    expect(searchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        published_after: '2020-03-01',
        published_before: '2022-06-30',
      }),
    )
  })

  it('uses pagination offset for page > 1', async () => {
    const uiParams = { q: 'test' }

    renderHook(() => useJobAdsQuery(uiParams, { page: 3, pageSize: 10 }))

    await waitFor(() => expect(searchMock).toHaveBeenCalled())

    expect(searchMock).toHaveBeenCalledWith(
      expect.objectContaining({ offset: 20, limit: 10, q: 'test' }),
    )
  })

  it('skips fetch when disabled', async () => {
    const uiParams = { q: 'test' }
    const { result } = renderHook(() =>
      useJobAdsQuery(uiParams, { enabled: false }),
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(searchMock).not.toHaveBeenCalled()
    expect(result.current.ads).toEqual([])
  })

  it('sets error state when search fails', async () => {
    searchMock.mockRejectedValue(new Error('API-fel'))
    const uiParams = { q: 'fail' }

    const { result } = renderHook(() => useJobAdsQuery(uiParams))

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toMatchObject({ message: 'API-fel' })
    expect(result.current.ads).toEqual([])
  })

  it('refetch triggers a new search', async () => {
    const uiParams = { q: 'test' }
    const { result } = renderHook(() => useJobAdsQuery(uiParams))

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(searchMock).toHaveBeenCalledTimes(1)

    act(() => {
      result.current.refetch()
    })

    await waitFor(() => expect(searchMock).toHaveBeenCalledTimes(2))
  })
})
