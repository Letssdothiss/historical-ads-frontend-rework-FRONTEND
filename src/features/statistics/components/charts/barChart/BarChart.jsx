import './BarChart.css'
import { DigiBarChart } from '@designsystem-se/af-react'
import { BarChartVariation } from '@designsystem-se/af'
import { toChartData } from '../../../utils/StatisticsTransformers'

function BarChart({ data, stacked = false }) {
  const chartData = toChartData(data)

  if (!chartData) return <p>Ingen data att visa</p>

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
