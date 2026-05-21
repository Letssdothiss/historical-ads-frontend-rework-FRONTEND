import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ErrorState from '../../../components/errorState/ErrorState'

vi.mock('@designsystem-se/af-react', () => ({
  DigiButton: ({ children, onAfOnClick }) => (
    <button type="button" onClick={onAfOnClick}>
      {children}
    </button>
  ),
}))

describe('ErrorState', () => {
  it('renders alert with title and message', () => {
    render(
      <ErrorState title="Fel" message="Kunde inte ladda data." />,
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Fel' })).toBeInTheDocument()
    expect(screen.getByText('Kunde inte ladda data.')).toBeInTheDocument()
  })

  it('calls onRetry when Försök igen is clicked', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()

    render(<ErrorState onRetry={onRetry} />)

    await user.click(screen.getByRole('button', { name: 'Försök igen' }))
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('hides retry button when onRetry is not provided', () => {
    render(<ErrorState />)

    expect(
      screen.queryByRole('button', { name: 'Försök igen' }),
    ).not.toBeInTheDocument()
  })
})
