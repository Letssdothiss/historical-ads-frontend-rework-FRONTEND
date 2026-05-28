// Svarformatet från /api/v1/stats är:
// { query_time_in_millis, result_time_in_millis, stats: { region: [{label, occurrences}], ... } }
//
// fetchStatistics returnerar alltid: [{ year: string, raw: apiResponse }, ...]
//
// Den här funktionen omvandlar det till internt radformat:
// [{ lan: 'Stockholms län', '2024': 1380100, '2025': 1450000 }, ...]

const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Mars',
  'April',
  'Maj',
  'Juni',
  'Juli',
  'Augusti',
  'September',
  'Oktober',
  'November',
  'December',
]

function parseMonthLabel(label) {
  // "2024-01" → "Januari"
  if (/^\d{4}-\d{2}$/.test(label)) {
    return MONTH_NAMES[parseInt(label.split('-')[1], 10) - 1] ?? label
  }
  // "01" eller "1" → "Januari"
  if (/^\d{1,2}$/.test(label)) {
    return MONTH_NAMES[parseInt(label, 10) - 1] ?? label
  }
  return label
}

function extractRegions(raw) {
  if (!raw) return []
  if (Array.isArray(raw.region)) {
    return raw.region
  }
  const stats = raw?.stats
  if (!stats) return []
  if (Array.isArray(stats)) {
    const regionStat = stats.find((s) => s.type === 'region')
    return (regionStat?.values ?? []).map(({ term, count }) => ({
      label: term,
      occurrences: count,
    }))
  }
  return stats?.region ?? []
}

export function mapStatisticsByMunicipality(yearResults) {
  if (!Array.isArray(yearResults) || yearResults.length === 0) return []

  const municipalityMap = new Map()

  for (const { year, raw } of yearResults) {
    if (raw?.error) continue
    const municipalities = raw?.stats?.municipality ?? raw?.municipality ?? []

    for (const { label, occurrences } of municipalities) {
      if (!municipalityMap.has(label)) {
        municipalityMap.set(label, { lan: label })
      }
      municipalityMap.get(label)[year] = occurrences
    }
  }

  return Array.from(municipalityMap.values())
}

export function mapStatisticsByMonth(yearResults) {
  console.log('[StatisticsMapper] mapStatisticsByMonth indata:', yearResults)
  if (!Array.isArray(yearResults) || yearResults.length === 0) return []

  const monthMap = new Map()

  for (const { year, raw } of yearResults) {
    if (raw?.error) continue
    const months = raw?.stats?.month ?? raw?.month ?? []
    console.log(`[StatisticsMapper] månadsdata år="${year}":`, months)

    for (const { label, occurrences } of months) {
      const monthName = parseMonthLabel(label)
      if (!monthMap.has(monthName)) {
        monthMap.set(monthName, { lan: monthName })
      }
      monthMap.get(monthName)[year] = occurrences
    }
  }

  const result = Array.from(monthMap.values())
  console.log('[StatisticsMapper] mapStatisticsByMonth resultat:', result)
  return result
}

export function mapStatisticsResponse(yearResults) {
  console.log('[StatisticsMapper] Inkommande yearResults:', yearResults)

  if (!Array.isArray(yearResults) || yearResults.length === 0) {
    console.warn('[StatisticsMapper] Tomt eller ogiltigt indata')
    return []
  }

  // Bygg en Map: regionnamn → { lan, year1: count, year2: count, ... }
  const regionMap = new Map()

  for (const { year, raw } of yearResults) {
    // Handle error responses
    if (raw?.error) {
      console.warn(`[StatisticsMapper] Error for year ${year}:`, raw.error)
      continue
    }

    // Extract regions - backend can return different formats:
    // 1. { stats: { region: [...] } } - wrapped format
    // 2. { region: [...] } - direct format
    // 3. { stats: { region: [...] }, ... } - stats object
    // const regions = raw?.stats?.region ?? raw?.region ?? []
    const regions = extractRegions(raw)

    console.log(
      `[StatisticsMapper] År="${year}" — ${regions.length} regioner:`,
      regions.slice(0, 3), // Log first 3 regions to prevent console spam
    )

    for (const { label, occurrences } of regions) {
      if (!regionMap.has(label)) {
        regionMap.set(label, { lan: label })
      }
      const before = regionMap.get(label)[year]
      regionMap.get(label)[year] = occurrences
      console.log(
        `[StatisticsMapper] ${label} - ${year}: ${before || 'NEW'} → ${occurrences}`,
      )
    }
  }

  const result = Array.from(regionMap.values())
  console.log('[StatisticsMapper] Slutresultat (', result.length, 'rader):')
  console.table(result.slice(0, 5)) // Log first 5 rows as table
  return result
}
