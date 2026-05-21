import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StatisticsChartPanel from '../../../components/statisticsChartPanel/StatisticsChartPanel'
import { exportStatistics } from '../../../api/StatisticsApi'

vi.mock('../../../api/StatisticsApi', () => ({
  exportStatistics: vi.fn(),
}))

vi.mock('../../../components/charts/barChart/BarChart', () => ({
  default: () => <div data-testid="bar-chart" />,
}))
vi.mock('../../../components/charts/lineChart/LineChart', () => ({
  default: () => <div data-testid="line-chart" />,
}))

vi.mock('@designsystem-se/af-react', () => ({
  DigiButton: ({ children, onAfOnClick }) => (
    <button type="button" onClick={onAfOnClick}>
      {children}
    </button>
  ),
  DigiTable: ({ children }) => <div data-testid="digi-table">{children}</div>,
  DigiFormRadiogroup: ({ children }) => <div>{children}</div>,
  DigiFormRadiobutton: ({ afLabel, onAfOnChange }) => (
    <label>
      <input type="radio" aria-label={afLabel} onChange={onAfOnChange} />
      {afLabel}
    </label>
  ),
  DigiIconBookmarkOutline: () => null,
  DigiIconChevronRight: () => null,
  DigiIconChevronUp: () => null,
  DigiIconFileExport: () => null,
  DigiIconPen: () => null,
}))

const tableData = [
  { lan: 'Stockholms län', 2024: 100, 2025: 150 },
  { lan: 'Skåne län', 2024: 80, 2025: 90 },
]

describe('StatisticsChartPanel', () => {
  beforeEach(() => {
    vi.mocked(exportStatistics).mockReset()
    vi.mocked(exportStatistics).mockResolvedValue(undefined)
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('renders summary and table rows from data', () => {
    render(
      <StatisticsChartPanel
        data={tableData}
        searchParams={{ kompetens: 'react', lan: ['Stockholm'] }}
      />,
    )

    expect(screen.getByRole('heading', { name: /react/ })).toBeInTheDocument()
    expect(screen.getByText('Stockholms län')).toBeInTheDocument()
    expect(screen.getByText('Skåne län')).toBeInTheDocument()
    expect(screen.getByText(/Totalt 420 annonser/)).toBeInTheDocument()
  })

  it('shows empty state when there is no data', () => {
    render(<StatisticsChartPanel data={[]} />)

    expect(
      screen.getByText('Inga resultat för den valda sökningen.'),
    ).toBeInTheDocument()
  })

  it('sorts table rows when a column header is clicked', async () => {
    const user = userEvent.setup()

    render(<StatisticsChartPanel data={tableData} />)

    const rows = () =>
      screen.getAllByRole('row').slice(1).map((row) => row.textContent)

    expect(rows()[0]).toContain('Stockholms län')

    const yearSort = screen.getByRole('button', { name: /2024/ })
    await user.click(yearSort)
    await user.click(yearSort)

    expect(rows()[0]).toContain('Skåne län')
  })

  it('shows toast when PNG export is not available', async () => {
    const user = userEvent.setup()

    render(
      <StatisticsChartPanel data={tableData} searchParams={{ q: 'test' }} />,
    )

    await user.click(screen.getByRole('button', { name: /Exportera sökresultat/ }))
    await user.click(screen.getByRole('button', { name: /Diagram som PNG/ }))
    await user.click(screen.getByRole('button', { name: 'Exportera' }))

    expect(
      screen.getByText('PNG-export är inte tillgänglig ännu.'),
    ).toBeInTheDocument()
    expect(exportStatistics).not.toHaveBeenCalled()
  })

  it('exports JSON when a supported format is chosen', async () => {
    const user = userEvent.setup()

    render(
      <StatisticsChartPanel
        data={tableData}
        searchParams={{ kompetens: 'react' }}
      />,
    )

    await user.click(screen.getByRole('button', { name: /Exportera sökresultat/ }))
    await user.click(screen.getByRole('button', { name: /Json \(json\)/ }))
    await user.click(screen.getByRole('button', { name: 'Exportera' }))

    expect(exportStatistics).toHaveBeenCalledWith(
      { kompetens: 'react' },
      'json',
    )
  })
})
