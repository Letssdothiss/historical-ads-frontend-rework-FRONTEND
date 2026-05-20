import './BarChart.css'
import { DigiBarChart } from '@designsystem-se/af-react'
import { BarChartVariation } from '@designsystem-se/af'
import { toBarChartData } from '../../../utils/StatisticsTransformers'

function BarChart({ data, stacked = false }) {
  const chartData = toBarChartData(data)

  if (!chartData) {
    return (
      <p>
        Välj minst två geografiska områden för att kunna visa diagrammet.
      </p>
    )
  }

  return (
    <div className="bar-chart">
      <DigiBarChart
        afChartData={chartData}
        afVariation={stacked ? BarChartVariation.Stacked : BarChartVariation.Vertical}
      />
    </div>
  )
}

export default BarChart
