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
    console.log('[StatisticsApi] Hämtar per år:', years, '— basparams:', baseParams)
    const results = await Promise.all(
      years.map(async (year) => {
        const apiParams = {
          ...baseParams,
          published_after: `${year}-01-01`,
          published_before: `${year}-12-31`,
        }
        console.log(`[StatisticsApi] Anrop för år ${year}:`, apiParams)
        const raw = await get('/stats', apiParams)
        console.log(`[StatisticsApi] Svar för år ${year}:`, raw)
        return { year: String(year), raw }
      }),
    )
    console.log('[StatisticsApi] Alla år klara:', results)
    return results
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
