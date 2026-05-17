import './LineChart.css'
import { DigiChartLine } from '@designsystem-se/af-react'
import { toChartData } from '../../../utils/StatisticsTransformers'

function LineChart({ data }) {
  const chartData = toChartData(data)

  if (!chartData) {
    return (
      <p>
        Välj minst två tidsperioder (t.ex. två årtal) för att kunna visa
        diagrammet.
      </p>
    )
  }

  // digi-chart-line's afChartDataUpdate watcher has a bug where the object-path
  // early-returns before initialising _coreSeries, which then crashes the
  // built-in "Visa tabell"-toggle. Passing the JSON-string variant hits the
  // parse branch that does the initialisation.
  return (
    <div className="line-chart">
      <DigiChartLine
        afChartData={JSON.stringify(chartData)}
        afHeadingLevel="h2"
      />
    </div>
  )
}

export default LineChart
