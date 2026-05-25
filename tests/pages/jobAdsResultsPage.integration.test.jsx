import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { http } from 'msw'
import JobAdsResultsPage from '../../src/pages/jobAdsResultsPage/JobAdsResultsPage'
import { ROUTES } from '../../src/shared/constants/routes'
import {
  API_BASE,
  emptySearchResponse,
  searchErrorResponse,
} from '../mocks/handlers.js'
import { server } from '../mocks/server.js'
import { renderPageAtRoute } from '../utils/renderWithRouter.jsx'

vi.mock('@designsystem-se/af-react', () => import('../utils/digiReactMock.jsx'))

vi.mock('../../src/app/layout/MainLayout', () => ({
  default: ({ children }) => <div data-testid="main-layout">{children}</div>,
}))

describe('JobAdsResultsPage (integration)', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  it('loads search results from the API and shows ad title and count', async () => {
    renderPageAtRoute(JobAdsResultsPage, {
      route: `${ROUTES.JOB_ADS_RESULTS}?q=react`,
      path: ROUTES.JOB_ADS_RESULTS,
    })

    expect(screen.getByText('Söker annonser...')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('1 annonser')).toBeInTheDocument()
    })

    expect(
      screen.getByRole('heading', { name: 'Integration testannons' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Sökresultat:.*react/)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Justera sökning' }),
    ).toBeInTheDocument()
  })

  it('shows empty state when the API returns no hits', async () => {
    server.use(http.get(`${API_BASE}/search`, () => emptySearchResponse()))

    renderPageAtRoute(JobAdsResultsPage, {
      route: ROUTES.JOB_ADS_RESULTS,
      path: ROUTES.JOB_ADS_RESULTS,
    })

    await waitFor(() => {
      expect(
        screen.getByText(
          'Inga annonser hittades. Prova att ändra sökkriterier.',
        ),
      ).toBeInTheDocument()
    })
  })

  it('shows error state with retry when the API fails', async () => {
    server.use(
      http.get(`${API_BASE}/search`, () => searchErrorResponse('Nätverksfel')),
    )

    renderPageAtRoute(JobAdsResultsPage, {
      route: ROUTES.JOB_ADS_RESULTS,
      path: ROUTES.JOB_ADS_RESULTS,
    })

    await waitFor(() => {
      expect(screen.getByText('Nätverksfel')).toBeInTheDocument()
    })

    expect(
      screen.getByRole('button', { name: 'Försök igen' }),
    ).toBeInTheDocument()
  })
})
