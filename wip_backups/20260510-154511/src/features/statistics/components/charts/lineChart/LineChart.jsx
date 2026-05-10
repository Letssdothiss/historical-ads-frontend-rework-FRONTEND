import './LineChart.css'
import { DigiChartLine } from '@designsystem-se/af-react'
import { toChartData } from '../../../utils/StatisticsTransformers'

function LineChart({ data }) {
  const chartData = toChartData(data)

  if (!chartData) return <p>Ingen data att visa</p>

  return (
    <div className="line-chart">
      <DigiChartLine afChartData={chartData} />
    </div>
  )
}

export default LineChart
