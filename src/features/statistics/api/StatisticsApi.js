import { get, getFile } from '../../../shared/api/HttpClient'

function toBaseApiParams(params = {}) {
  const apiParams = {}
  if (params.kompetens) {
    apiParams.q = params.kompetens
  } else if (params.q) {
    apiParams.q = params.q
  }
  if (params.skills?.length) apiParams.skills = params.skills
  if (params.municipality?.length) apiParams.municipality = params.municipality
  if (params.occupation_group?.length) {
    apiParams.occupation_group = params.occupation_group
  } else if (params.yrkesgrupp?.length) {
    apiParams.occupation_group = params.yrkesgrupp
  }
  if (params.employment_type?.length)
    apiParams.employment_type = params.employment_type
  if (params.driving_license_required != null)
    apiParams.driving_license_required = params.driving_license_required
  return apiParams
}

export async function fetchStatistics(params) {
  const years = params?.ar?.length > 0 ? params.ar : null
  const baseParams = toBaseApiParams(params)
  console.log('[StatisticsApi] baseParams:', baseParams)
  if (years) {
    const apiParams = {
      ...baseParams,
      aggregate: 'year_region',
      years: years.join(','),
    }
    const raw = await get('/stats', apiParams)
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
    return [{ year: 'Totalt', raw }]
  }
  const raw = await get('/stats', baseParams)
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
