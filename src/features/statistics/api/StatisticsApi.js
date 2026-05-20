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
  const baseParams = toBaseApiParams(params)

  if (years) {
    const apiParams = {
      ...baseParams,
      aggregate: 'year_region',
      years: years.join(','),
    }
    console.log('[StatisticsApi] Hämtar med aggregate=year_region:', apiParams)
    const raw = await get('/stats', apiParams)
    console.log('[StatisticsApi] Svar:', raw)

    const statsByYear = raw?.stats_by_year
    if (statsByYear) {
      return years.map((year) => ({
        year: String(year),
        raw: {
          stats: {
            region: statsByYear[String(year)]?.region ?? [],
            month: statsByYear[String(year)]?.month ?? [],
          },
        },
      }))
    }

    // Fallback om backend returnerar gammalt format
    return [{ year: 'Totalt', raw }]
  }

  console.log('[StatisticsApi] Hämtar totalt (inget år valt):', baseParams)
  const raw = await get('/stats', baseParams)
  console.log('[StatisticsApi] Svar totalt:', raw)
  return [{ year: 'Totalt', raw }]
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
