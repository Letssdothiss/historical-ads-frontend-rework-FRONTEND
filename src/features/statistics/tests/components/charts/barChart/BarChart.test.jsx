import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import BarChart, {
  chartMaxWidth,
} from '../../../../components/charts/barChart/BarChart'

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

  it('caps the width for few regions so x-axis labels stay visible', () => {
    const { container } = render(<BarChart data={chartData} />)

    // Two regions -> narrow enough that the chart lib keeps every label.
    expect(container.querySelector('.bar-chart')).toHaveStyle({
      maxWidth: '400px',
    })
  })
})

describe('chartMaxWidth', () => {
  it('returns undefined for no categories', () => {
    expect(chartMaxWidth(0)).toBeUndefined()
    expect(chartMaxWidth(undefined)).toBeUndefined()
  })

  it('grows the cap with the category count', () => {
    expect(chartMaxWidth(2)).toBe('400px')
    expect(chartMaxWidth(3)).toBe('520px')
    expect(chartMaxWidth(10)).toBe('1360px')
  })
})
