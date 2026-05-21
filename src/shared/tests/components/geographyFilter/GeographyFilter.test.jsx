import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GeographyFilter from '../../../components/geographyFilter/GeographyFilter'
import { useGeographyData } from '../../../hooks/useGeographyData'

vi.mock('../../../hooks/useGeographyData')

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
      aria-label="Sök län eller kommun"
      value={afValue}
      onChange={(e) =>
        onAfOnInput?.({ detail: { target: { value: e.target.value } } })
      }
    />
  ),
  DigiFormLabel: ({ afLabel }) => <span>{afLabel}</span>,
  DigiIconChevronRight: () => null,
}))

const lanData = {
  'Stockholms län': ['Stockholm', 'Nacka'],
  'Skåne län': ['Malmö'],
}

describe('GeographyFilter', () => {
  beforeEach(() => {
    vi.mocked(useGeographyData).mockReturnValue({
      lanData,
      loading: false,
      error: null,
    })
  })

  it('shows loading state', () => {
    vi.mocked(useGeographyData).mockReturnValue({
      lanData: {},
      loading: true,
      error: null,
    })

    render(<GeographyFilter />)

    expect(screen.getByText('Laddar geografi...')).toBeInTheDocument()
  })

  it('applies selected län and kommun with grouped payload', async () => {
    const user = userEvent.setup()
    const onApply = vi.fn()

    render(<GeographyFilter onApply={onApply} />)

    await user.click(screen.getByRole('option', { name: /Stockholms län/ }))
    await user.click(screen.getByLabelText('Stockholm'))
    await user.click(screen.getByRole('button', { name: 'Lägg till och stäng' }))

    expect(onApply).toHaveBeenCalledWith({
      lan: ['Stockholms län'],
      kommuner: ['Stockholm'],
      grouped: { 'Stockholms län': ['Stockholm'] },
    })
  })
})
