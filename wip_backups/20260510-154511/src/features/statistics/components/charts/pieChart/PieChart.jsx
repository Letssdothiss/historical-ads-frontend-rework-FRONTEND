import './PieChart.css'
import { DigiBarChart } from '@designsystem-se/af-react'
import { BarChartVariation } from '@designsystem-se/af'
import { toChartData } from '../../../utils/StatisticsTransformers'

// Designsystemet saknar en riktig pajdiagram-komponent.
// DigiBarChart i horisontellt läge används som närmaste alternativ.
function PieChart({ data }) {
  const chartData = toChartData(data)

  if (!chartData) return <p>Ingen data att visa</p>

  return (
    <div className="pie-chart">
      <DigiBarChart
        afChartData={chartData}
        afVariation={BarChartVariation.Horizontal}
      />
    </div>
  )
}

export default PieChart
