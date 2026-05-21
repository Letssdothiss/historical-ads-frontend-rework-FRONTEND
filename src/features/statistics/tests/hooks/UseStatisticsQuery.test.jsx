import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { fetchStatistics } from '../../api/StatisticsApi'
import { useStatisticsQuery } from '../../hooks/UseStatisticsQuery'

vi.mock('../../api/StatisticsApi', () => ({
  fetchStatistics: vi.fn(),
}))

const fetchStatisticsMock = vi.mocked(fetchStatistics)

describe('useStatisticsQuery', () => {
  beforeEach(() => {
    fetchStatisticsMock.mockReset()
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('fetches and maps statistics data', async () => {
    fetchStatisticsMock.mockResolvedValue([
      {
        year: '2024',
        raw: {
          stats: {
            region: [{ label: 'Skåne län', occurrences: 100 }],
          },
        },
      },
    ])

    const params = { lan: ['Skåne län'], ar: ['2024'] }
    const { result } = renderHook(() => useStatisticsQuery(params))

    expect(result.current.loading).toBe(true)

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(fetchStatisticsMock).toHaveBeenCalledWith(params)
    expect(result.current.data).toEqual([
      { lan: 'Skåne län', 2024: 100 },
    ])
    expect(result.current.error).toBeNull()
  })

  it('sets error when fetch fails', async () => {
    fetchStatisticsMock.mockRejectedValue(new Error('API-fel'))

    const params = { kompetens: 'test' }
    const { result } = renderHook(() => useStatisticsQuery(params))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toMatchObject({ message: 'API-fel' })
    expect(result.current.data).toBeNull()
  })

  it('does not fetch when params is null', async () => {
    const { result } = renderHook(() => useStatisticsQuery(null))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(fetchStatisticsMock).not.toHaveBeenCalled()
    expect(result.current.data).toBeNull()
  })

  it('refetches when params change', async () => {
    fetchStatisticsMock.mockResolvedValue([])

    const initialParams = { kompetens: 'a' }
    const { result, rerender } = renderHook(
      ({ params }) => useStatisticsQuery(params),
      { initialProps: { params: initialParams } },
    )

    await waitFor(() => expect(fetchStatisticsMock).toHaveBeenCalledTimes(1))

    rerender({ params: { kompetens: 'b' } })

    await waitFor(() => expect(fetchStatisticsMock).toHaveBeenCalledTimes(2))
    expect(fetchStatisticsMock).toHaveBeenLastCalledWith({ kompetens: 'b' })
    await waitFor(() => expect(result.current.loading).toBe(false))
  })
})
