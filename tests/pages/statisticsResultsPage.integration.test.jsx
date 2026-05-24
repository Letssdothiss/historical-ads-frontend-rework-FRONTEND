import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { http } from 'msw'
import StatisticsResultsPage from '../../src/pages/statisticsResultsPage/StatisticsResultsPage'
import { ROUTES } from '../../src/shared/constants/routes'
import { API_BASE, statsErrorResponse } from '../mocks/handlers.js'
import { server } from '../mocks/server.js'
import { renderPageAtRoute } from '../utils/renderWithRouter.jsx'

vi.mock('@designsystem-se/af-react', () => import('../utils/digiReactMock.jsx'))

vi.mock('../../src/app/layout/MainLayout', () => ({
  default: ({ children }) => <div data-testid="main-layout">{children}</div>,
}))

vi.mock(
  '../../src/features/statistics/components/statisticsChartPanel/StatisticsChartPanel',
  () => ({
    default: ({ data }) => (
      <div data-testid="stats-chart-panel">{data?.length ?? 0} region rows</div>
    ),
  }),
)

describe('StatisticsResultsPage (integration)', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  it('fetches stats and passes mapped data to the chart panel', async () => {
    renderPageAtRoute(StatisticsResultsPage, {
      route: `${ROUTES.STATISTICS_RESULTS}?q=data`,
      path: ROUTES.STATISTICS_RESULTS,
    })

    expect(screen.getByText('Hämtar statistik...')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByTestId('stats-chart-panel')).toHaveTextContent(
        '1 region rows',
      )
    })

    expect(
      screen.getByRole('button', { name: 'Justera sökning' }),
    ).toBeInTheDocument()
  })

  it('shows error message when stats API fails', async () => {
    server.use(
      http.get(`${API_BASE}/stats`, () =>
        statsErrorResponse('Kunde inte hämta data'),
      ),
    )

    renderPageAtRoute(StatisticsResultsPage, {
      route: ROUTES.STATISTICS_RESULTS,
      path: ROUTES.STATISTICS_RESULTS,
    })

    await waitFor(() => {
      expect(
        screen.getByText(/Kunde inte hämta statistik: Kunde inte hämta data/),
      ).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: 'Tillbaka' })).toBeInTheDocument()
  })
})
