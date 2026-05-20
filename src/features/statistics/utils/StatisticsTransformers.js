// Converts flat row data to bar chart format: x-axis = regions, series = years.
// This is the correct structure for DigiBarChart (Vertical/Stacked).
export function toBarChartData(data, options = {}) {
  const { title = 'Statistik', xLabel = 'Område', yLabel = 'Antal annonser' } = options
  if (!data || !Array.isArray(data) || data.length === 0) return null
  if (!data[0] || typeof data[0] !== 'object') return null

  const years = Object.keys(data[0]).filter((k) => k !== 'lan' && k !== 'title')
  if (years.length === 0) return null

  const rows = data.filter((row) => row && row.lan)
  // digi-bar-chart accesses xScale.domain()[1] on resize; need at least 2 x values.
  if (rows.length < 2) return null

  return {
    title,
    x: xLabel,
    y: yLabel,
    data: {
      xValues: rows.map((_, i) => i),
      xValueNames: rows.map((row) => row.lan),
      series: years.map((year) => ({
        title: year,
        yValues: rows.map((row) => Number(row[year]) || 0),
      })),
    },
  }
}

// Converts flat row data [{lan, '2024': n, '2025': n}] to ChartLineData format.
// x-axis = years, series = regions — used for line charts.
export function toChartData(data, options = {}) {
  const {
    title = 'Statistik',
    xLabel = 'År',
    yLabel = 'Antal annonser',
  } = options
  if (!data || !Array.isArray(data) || data.length === 0) return null
  if (!data[0] || typeof data[0] !== 'object') return null

  const years = Object.keys(data[0]).filter((k) => k !== 'lan' && k !== 'title')
  // digi-bar-chart accesses xScale.domain()[1] on resize, so we need at least
  // 2 distinct x values; bail out otherwise to avoid a runtime crash.
  if (years.length < 2) return null

  const series = data
    .filter((row) => row && row.lan)
    .map((row) => ({
      title: row.lan,
      yValues: years.map((y) => {
        const val = row[y]
        return val !== null && val !== undefined && !isNaN(val)
          ? Number(val)
          : 0
      }),
    }))

  if (series.length === 0) return null

  return {
    title,
    x: xLabel,
    y: yLabel,
    data: {
      // Fall back to positional index when a year label isn't numeric (e.g. "Totalt"),
      // otherwise the chart library calls toLocaleString on NaN/undefined and crashes.
      xValues: years.map((y, i) => {
        const n = Number(y)
        return Number.isFinite(n) ? n : i
      }),
      xValueNames: years,
      series,
    },
  }
}

// Converts antal (count) to andel (share %) per row across all years
export function toAndel(data) {
  return data.map((row) => {
    const years = Object.keys(row).filter((k) => k !== 'lan')
    const total = years.reduce((sum, y) => sum + (row[y] ?? 0), 0)

    const andelRow = { lan: row.lan }
    for (const y of years) {
      andelRow[y] =
        total > 0 ? parseFloat(((row[y] / total) * 100).toFixed(1)) : 0
    }
    return andelRow
  })
}
