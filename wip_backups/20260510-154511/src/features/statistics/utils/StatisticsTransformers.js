// Converts flat row data [{lan, '2024': n, '2025': n}] to ChartLineData format
export function toChartData(data, options = {}) {
  const { title = 'Statistik', xLabel = 'År', yLabel = 'Antal annonser' } = options
  if (!data || data.length === 0) return null

  const years = Object.keys(data[0]).filter(k => k !== 'lan')

  return {
    title,
    x: xLabel,
    y: yLabel,
    data: {
      xValues: years.map(Number),
      xValueNames: years,
      series: data.map(row => ({
        title: row.lan,
        yValues: years.map(y => row[y] ?? 0),
      })),
    },
  }
}

// Converts antal (count) to andel (share %) per row across all years
export function toAndel(data) {
  return data.map(row => {
    const years = Object.keys(row).filter(k => k !== 'lan')
    const total = years.reduce((sum, y) => sum + (row[y] ?? 0), 0)

    const andelRow = { lan: row.lan }
    for (const y of years) {
      andelRow[y] = total > 0 ? ((row[y] / total) * 100).toFixed(1) + '%' : '0%'
    }
    return andelRow
  })
}
