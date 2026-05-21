import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AppRoutes from '../../src/app/Routes'
import { ROUTES } from '../../src/shared/constants/routes'

vi.mock('@designsystem-se/af-react', () => import('../utils/digiReactMock.jsx'))

vi.mock('../../src/app/layout/MainLayout', () => ({
  default: ({ children }) => <div data-testid="main-layout">{children}</div>,
}))

describe('NotFoundPage (smoke)', () => {
  it('renders 404 content for unknown routes', () => {
    render(
      <MemoryRouter initialEntries={['/finns-inte']}>
        <AppRoutes />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { level: 1, name: '404' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Sidan kunde inte hittas',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Länken är felaktig eller har tagits bort.'),
    ).toBeInTheDocument()
  })

  it('links back to job ads search', () => {
    render(
      <MemoryRouter initialEntries={['/unknown']}>
        <AppRoutes />
      </MemoryRouter>,
    )

    const backLink = screen.getByRole('link', {
      name: 'Tillbaka till sökningen',
    })
    expect(backLink).toHaveAttribute('href', ROUTES.JOB_ADS)
  })
})
