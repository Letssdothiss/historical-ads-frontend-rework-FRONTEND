import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import BarChart from '../../../../components/charts/barChart/BarChart'

vi.mock('@designsystem-se/af-react', () => ({
  DigiBarChart: ({ afChartData }) => (
    <div data-testid="digi-bar-chart">{afChartData?.title}</div>
  ),
}))

const chartData = [
  { lan: 'Stockholms län', 2024: 100, 2025: 150 },
  { lan: 'Skåne län', 2024: 80, 2025: 90 },
]

describe('BarChart', () => {
  it('shows helper text when there is not enough data', () => {
    render(<BarChart data={[{ lan: 'Endast ett län', 2024: 10 }]} />)

    expect(
      screen.getByText(
        /Välj minst två geografiska områden för att kunna visa diagrammet/,
      ),
    ).toBeInTheDocument()
  })

  it('renders chart when data has at least two regions', () => {
    render(<BarChart data={chartData} />)

    expect(screen.getByTestId('digi-bar-chart')).toHaveTextContent('Statistik')
  })

  it('passes stacked variation to the design system chart', () => {
    render(<BarChart data={chartData} stacked />)

    expect(screen.getByTestId('digi-bar-chart')).toBeInTheDocument()
  })
})
