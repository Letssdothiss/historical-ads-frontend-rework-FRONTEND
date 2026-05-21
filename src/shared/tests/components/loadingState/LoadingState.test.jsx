import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import LoadingState from '../../../components/loadingState/LoadingState'

vi.mock('@designsystem-se/af-react', () => ({
  DigiLoaderSpinner: () => <div data-testid="spinner" />,
}))

describe('LoadingState', () => {
  it('renders status region with default text', () => {
    render(<LoadingState />)

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText('Laddar innehåll...')).toBeInTheDocument()
    expect(screen.getByTestId('spinner')).toBeInTheDocument()
  })

  it('renders custom loading text', () => {
    render(<LoadingState text="Hämtar annonser..." />)

    expect(screen.getByText('Hämtar annonser...')).toBeInTheDocument()
  })
})
