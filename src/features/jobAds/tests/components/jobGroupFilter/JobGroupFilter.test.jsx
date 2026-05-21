import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import JobGroupFilter from '../../../components/jobGroupFilter/JobGroupFilter'
import { useJobData } from '../../../hooks/useJobData'

vi.mock('../../../hooks/useJobData')

vi.mock('@designsystem-se/af-react', () => ({
  DigiButton: ({ children, onClick, onAfOnClick }) => (
    <button type="button" onClick={onClick ?? onAfOnClick}>
      {children}
    </button>
  ),
  DigiFormCheckbox: ({ afLabel, id, onAfOnChange }) =>
    id ? (
      <input
        id={id}
        type="checkbox"
        onChange={(e) =>
          onAfOnChange?.({ detail: { target: { checked: e.target.checked } } })
        }
      />
    ) : (
      <label>
        <input
          type="checkbox"
          aria-label={afLabel}
          onChange={(e) =>
            onAfOnChange?.({ detail: { target: { checked: e.target.checked } } })
          }
        />
        {afLabel}
      </label>
    ),
  DigiFormInput: ({ afValue, onAfOnInput }) => (
    <input
      aria-label="Sök yrkesområde eller yrkesgrupp"
      value={afValue}
      onChange={(e) =>
        onAfOnInput?.({ detail: { target: { value: e.target.value } } })
      }
    />
  ),
  DigiFormLabel: ({ afLabel }) => <span>{afLabel}</span>,
  DigiIconChevronRight: () => <span aria-hidden="true">›</span>,
  DigiIconX: () => null,
}))

const jobData = {
  IT: ['Utvecklare', 'Testare'],
  Hälsa: ['Sjuksköterska'],
}

describe('JobGroupFilter', () => {
  beforeEach(() => {
    vi.mocked(useJobData).mockReturnValue({
      jobData,
      loading: false,
      error: null,
    })
  })

  it('shows loading state', () => {
    vi.mocked(useJobData).mockReturnValue({
      jobData: {},
      loading: true,
      error: null,
    })

    render(<JobGroupFilter />)

    expect(screen.getByText('Laddar yrkesdata...')).toBeInTheDocument()
  })

  it('shows error state and closes', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    vi.mocked(useJobData).mockReturnValue({
      jobData: {},
      loading: false,
      error: 'Kunde inte hämta data',
    })

    render(<JobGroupFilter onClose={onClose} />)

    expect(screen.getByText('Kunde inte hämta data')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Stäng' }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('applies selected area and groups', async () => {
    const user = userEvent.setup()
    const onApply = vi.fn()
    const onClose = vi.fn()

    render(<JobGroupFilter onApply={onApply} onClose={onClose} />)

    await user.click(screen.getByRole('option', { name: /IT/ }))
    await user.click(screen.getByLabelText('Utvecklare'))
    await user.click(screen.getByRole('button', { name: 'Lägg till och stäng' }))

    expect(onApply).toHaveBeenCalledWith({
      areas: ['IT'],
      groups: ['Utvecklare'],
    })
    expect(onClose).toHaveBeenCalledOnce()
  })
})
