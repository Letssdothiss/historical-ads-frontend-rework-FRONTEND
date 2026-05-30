// Converts flat row data to bar chart format: x-axis = regions, series = years.
// This is the correct structure for DigiBarChart (Vertical/Stacked).
export function toBarChartData(data, options = {}) {
  const {
    title = 'Statistik',
    xLabel = 'Område',
    yLabel = 'Antal annonser',
  } = options
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

  // Normally each column (year) is an x-value and each row (region/month) is a
  // series. But when only a single period is selected while there are several
  // rows — e.g. one year with all months — there's just one x-value, so a line
  // can't be drawn. Transpose: put the row labels (months) on the x-axis and
  // draw the single column as one series. This lets "one year + all months"
  // render a month-over-month line instead of the "pick two periods" message.
  if (years.length === 1) {
    const rows = data.filter((row) => row && row.lan)
    // digi-bar-chart accesses xScale.domain()[1] on resize, so we need at least
    // 2 distinct x values; bail out otherwise to avoid a runtime crash.
    if (rows.length < 2) return null
    const col = years[0]
    return {
      title,
      x: xLabel,
      y: yLabel,
      data: {
        xValues: rows.map((_, i) => i),
        xValueNames: rows.map((row) => row.lan),
        series: [
          {
            title: col,
            yValues: rows.map((row) => {
              const val = row[col]
              return val !== null && val !== undefined && !isNaN(val)
                ? Number(val)
                : 0
            }),
          },
        ],
      },
    }
  }

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

// Converts antal (count) to andel (share %): each cell as its share of the
// grand total across every region and year. This makes a single-year search
// show each region's share of that year (summing to 100% across regions),
// instead of the old per-row math where one year was always 100%. Using the
// grand total keeps shares meaningful and additive regardless of pivot
// orientation.
export function toAndel(data) {
  if (!Array.isArray(data) || data.length === 0) return data

  const years = Object.keys(data[0]).filter((k) => k !== 'lan')
  const grandTotal = data.reduce(
    (sum, row) => sum + years.reduce((s, y) => s + (Number(row[y]) || 0), 0),
    0,
  )

  return data.map((row) => {
    const andelRow = { lan: row.lan }
    for (const y of years) {
      andelRow[y] =
        grandTotal > 0
          ? parseFloat((((Number(row[y]) || 0) / grandTotal) * 100).toFixed(1))
          : 0
    }
    return andelRow
  })
}
