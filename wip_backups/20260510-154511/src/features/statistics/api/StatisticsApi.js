import { get, getFile } from '../../../shared/api/HttpClient'

// Konverterar interna params till API-params, exklusive år (hanteras separat)
function toBaseApiParams(params = {}) {
  const apiParams = {}
  if (params.kompetens) apiParams.q = params.kompetens
  if (params.lan?.length) apiParams.region = params.lan
  if (params.yrkesgrupp?.length) apiParams.occupation_group = params.yrkesgrupp
  return apiParams
}

// Returnerar alltid en array av { year: string, raw: apiResponse }
// Om år är valda: ett anrop per år (parallellt)
// Om inga år: ett anrop utan tidsbegränsning med year='Totalt'
export async function fetchStatistics(params) {
  const years = params?.ar?.length > 0 ? params.ar : null
  const baseParams = toBaseApiParams(params)

  if (years) {
    console.log('[StatisticsApi] Hämtar per år:', years, '— basparams:', baseParams)

    const results = await Promise.all(
      years.map(async year => {
        const apiParams = {
          ...baseParams,
          published_after: `${year}-01-01`,
          published_before: `${year}-12-31`,
        }
        console.log(`[StatisticsApi] Anrop för år ${year}:`, apiParams)
        const raw = await get('/api/v1/stats', apiParams)
        console.log(`[StatisticsApi] Svar för år ${year}:`, raw)
        return { year: String(year), raw }
      })
    )

    console.log('[StatisticsApi] Alla år klara:', results)
    return results
  }

  // Inget år valt — hämta alla tider
  console.log('[StatisticsApi] Hämtar totalt (inget år valt):', baseParams)
  const raw = await get('/api/v1/stats', baseParams)
  console.log('[StatisticsApi] Svar totalt:', raw)
  return [{ year: 'Totalt', raw }]
}

// Triggar nedladdning av fil från backend (xlsx, json)
// PNG/PDF är inte implementerat — hanteras i StatisticsChartPanel
export async function exportStatistics(params, format) {
  const apiParams = { ...toBaseApiParams(params), format }

  if (params?.ar?.length) {
    const years = params.ar.map(Number).sort((a, b) => a - b)
    apiParams.published_after = `${years[0]}-01-01`
    apiParams.published_before = `${years[years.length - 1]}-12-31`
  }

  console.log('[StatisticsApi] exportStatistics — params som skickas:', apiParams)
  const { blob, contentType } = await getFile('/api/v1/export', apiParams)
  console.log('[StatisticsApi] Exportfil mottagen:', contentType, blob.size, 'bytes')

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `statistik.${format}`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
