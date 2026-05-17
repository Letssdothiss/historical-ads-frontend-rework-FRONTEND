import { get, getFile } from '../../../shared/api/HttpClient'

function toBaseApiParams(params = {}) {
  const apiParams = {}
  // Use kompetens if provided, otherwise fall back to q
  if (params.kompetens) {
    apiParams.q = params.kompetens
  } else if (params.q) {
    apiParams.q = params.q
  }

  if (params.skills?.length) apiParams.skills = params.skills

  // Use region if provided, otherwise fall back to lan
  if (params.region?.length) {
    apiParams.region = params.region
  } else if (params.lan?.length) {
    apiParams.region = params.lan
  }

  if (params.municipality?.length) apiParams.municipality = params.municipality

  // Use occupation_group if provided, otherwise fall back to yrkesgrupp
  if (params.occupation_group?.length) {
    apiParams.occupation_group = params.occupation_group
  } else if (params.yrkesgrupp?.length) {
    apiParams.occupation_group = params.yrkesgrupp
  }

  if (params.occupation_field?.length)
    apiParams.occupation_field = params.occupation_field
  if (params.employment_type?.length)
    apiParams.employment_type = params.employment_type
  if (params.driving_license_required != null)
    apiParams.driving_license_required = params.driving_license_required
  return apiParams
}

export async function fetchStatistics(params) {
  const years = params?.ar?.length > 0 ? params.ar : null
  const apiParams = toBaseApiParams(params)

  // Add years if specified - backend will use per-year aggregation
  if (years?.length > 0) {
    apiParams.years = years
  }

  console.log(
    '[StatisticsApi.fetchStatistics] Fetching with params:',
    apiParams,
  )

  try {
    const response = await get('/stats', apiParams)
    console.log('[StatisticsApi] Response:', response)

    // Backend now returns stats_by_year with pre-computed region/month counts
    // Format: { stats_by_year: { "2024": { region: [...], month: [...], total_occurrences }, ... } }
    if (response.stats_by_year) {
      const results = Object.entries(response.stats_by_year).map(
        ([year, yearStats]) => {
          // Transform backend format to mapper format
          // yearStats has: { region: [...], month: [...], total_occurrences }
          // Mapper expects: { stats: { region: [...] } }
          return {
            year,
            raw: {
              stats: yearStats, // Already has region, month, total_occurrences
            },
          }
        },
      )

      console.log('[StatisticsApi] Transformed results:', results)
      console.log(
        '[StatisticsApi] Aggregation source:',
        response.aggregation_source,
      )
      if (response.meta) {
        console.log('[StatisticsApi] Meta:', response.meta)
      }

      return results
    }

    // Fallback for single year or no year - regular stats format
    return [
      {
        year: years?.length === 1 ? years[0] : 'Totalt',
        raw: response,
      },
    ]
  } catch (err) {
    console.error('[StatisticsApi] Error fetching statistics:', err)
    throw err
  }
}

export async function exportStatistics(params, format) {
  const apiParams = { ...toBaseApiParams(params), format }

  if (params?.ar?.length) {
    const years = params.ar.map(Number).sort((a, b) => a - b)
    apiParams.published_after = `${years[0]}-01-01`
    apiParams.published_before = `${years[years.length - 1]}-12-31`
  }

  const { blob } = await getFile('/export', apiParams)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `statistik.${format}`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
