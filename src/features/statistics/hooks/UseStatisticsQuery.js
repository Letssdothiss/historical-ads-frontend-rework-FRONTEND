import { useEffect, useState } from 'react'
import { fetchStatistics } from '../api/StatisticsApi'
import { mapStatisticsResponse } from '../api/StatisticsMapper'

export function useStatisticsQuery(params) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!params) return
    console.log('[useStatisticsQuery] Hämtar statistik med params:', params)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    setError(null)

    fetchStatistics(params)
      .then((raw) => {
        const mapped = mapStatisticsResponse(raw)
        console.log('[useStatisticsQuery] Mappad data:', mapped)
        return mapped
      })
      .then(setData)
      .catch((err) => {
        console.error('[useStatisticsQuery] Fel:', err)
        setError(err)
      })
      .finally(() => setLoading(false))
  }, [params])

  return { data, loading, error }
}
