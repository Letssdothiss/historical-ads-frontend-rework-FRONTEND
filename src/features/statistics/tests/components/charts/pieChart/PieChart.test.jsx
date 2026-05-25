import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import PieChart from '../../../../components/charts/pieChart/PieChart'

vi.mock('@designsystem-se/af-react', () => ({
  DigiBarChart: () => <div data-testid="digi-bar-chart" />,
}))

const chartData = [
  { lan: 'Stockholms län', 2024: 100, 2025: 150 },
  { lan: 'Skåne län', 2024: 80, 2025: 90 },
]

describe('PieChart', () => {
  it('shows message when chart data cannot be built', () => {
    render(<PieChart data={[]} />)

    expect(screen.getByText('Ingen data att visa')).toBeInTheDocument()
  })

  it('renders horizontal bar chart as pie substitute', () => {
    render(<PieChart data={chartData} />)

    expect(screen.getByTestId('digi-bar-chart')).toBeInTheDocument()
  })
})
