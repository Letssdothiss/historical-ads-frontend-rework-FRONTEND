import './BarChart.css'
import { DigiBarChart } from '@designsystem-se/af-react'
import { BarChartVariation } from '@designsystem-se/af'
import { toBarChartData } from '../../../utils/StatisticsTransformers'

/**
 * Width cap (px) that keeps DigiBarChart's x-axis labels visible.
 *
 * On a wide vertical chart with few categories the component's tick-spacing math
 * divides by zero (`nTh` rounds to 0), so it drops every label but the first and
 * truncates that one to three characters. Limiting the width for small category
 * counts keeps that divisor ≥ 1. ~120px per category plus a margin allowance
 * stays comfortably clear of the bug; once there are enough bars the cap exceeds
 * the container and has no effect.
 */
export function chartMaxWidth(categoryCount) {
  if (!categoryCount || categoryCount < 1) return undefined
  return `${categoryCount * 120 + 160}px`
}

function BarChart({ data, stacked = false }) {
  const chartData = toBarChartData(data)

  if (!chartData) {
    return (
      <p>Välj minst två geografiska områden för att kunna visa diagrammet.</p>
    )
  }

  const maxWidth = chartMaxWidth(chartData.data.xValueNames?.length)

  return (
    <div className="bar-chart" style={maxWidth ? { maxWidth } : undefined}>
      <DigiBarChart
        afChartData={chartData}
        afVariation={
          stacked ? BarChartVariation.Stacked : BarChartVariation.Vertical
        }
      />
    </div>
  )
}

export default BarChart
