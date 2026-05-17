// Svarformatet från /api/v1/stats är:
// { query_time_in_millis, result_time_in_millis, stats: { region: [{label, occurrences}], ... } }
//
// fetchStatistics returnerar alltid: [{ year: string, raw: apiResponse }, ...]
//
// Den här funktionen omvandlar det till internt radformat:
// [{ lan: 'Stockholms län', '2024': 1380100, '2025': 1450000 }, ...]

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
    const regions = raw?.stats?.region ?? raw?.region ?? []

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
