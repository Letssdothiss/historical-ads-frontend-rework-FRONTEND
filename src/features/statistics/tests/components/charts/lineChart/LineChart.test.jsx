import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import LineChart from '../../../../components/charts/lineChart/LineChart'

vi.mock('@designsystem-se/af-react', () => ({
  DigiChartLine: ({ afChartData }) => (
    <div data-testid="digi-line-chart">{afChartData}</div>
  ),
}))

const chartData = [
  { lan: 'Stockholms län', 2024: 100, 2025: 150 },
  { lan: 'Skåne län', 2024: 80, 2025: 90 },
]

describe('LineChart', () => {
  it('shows helper text when there are fewer than two time periods', () => {
    render(<LineChart data={[{ lan: 'Stockholms län', 2024: 100 }]} />)

    expect(
      screen.getByText(
        /Välj minst två tidsperioder \(t\.ex\. två årtal\) för att kunna visa/,
      ),
    ).toBeInTheDocument()
  })

  it('renders chart with stringified chart data for the design system', () => {
    render(<LineChart data={chartData} />)

    const chart = screen.getByTestId('digi-line-chart')
    expect(chart.textContent).toContain('Statistik')
    expect(chart.textContent).toContain('2024')
  })
})
