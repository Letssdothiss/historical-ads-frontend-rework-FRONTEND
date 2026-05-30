import './BarChart.css'
import { DigiBarChart } from '@designsystem-se/af-react'
import { BarChartVariation } from '@designsystem-se/af'
import { toBarChartData } from '../../../utils/StatisticsTransformers'
import { chartMaxWidth } from '../../../utils/chartUtils' // ← add this

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
