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
  DigiFormCheckbox: ({ afLabel, id, afChecked, onAfOnChange }) =>
    id ? (
      <input
        id={id}
        type="checkbox"
        checked={!!afChecked}
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
            onAfOnChange?.({
              detail: { target: { checked: e.target.checked } },
            })
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
  'Stockholms län': {
    id: 'lan-stockholm',
    kommuner: [
      { id: 'k-stockholm', label: 'Stockholm' },
      { id: 'k-nacka', label: 'Nacka' },
    ],
  },
  'Skåne län': {
    id: 'lan-skane',
    kommuner: [{ id: 'k-malmo', label: 'Malmö' }],
  },
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
    await user.click(
      screen.getByRole('button', { name: 'Lägg till och stäng' }),
    )

    expect(onApply).toHaveBeenCalledWith({
      lan: [],
      kommuner: ['k-stockholm'],
      grouped: { 'Stockholms län': ['Stockholm'] },
    })
  })

  it('expands a län to all its kommuner when none are individually picked', async () => {
    const user = userEvent.setup()
    const onApply = vi.fn()

    render(<GeographyFilter onApply={onApply} />)

    // Mark the län but pick no specific kommun, then apply.
    await user.click(screen.getByRole('option', { name: /Stockholms län/ }))
    await user.click(
      screen.getByRole('button', { name: 'Lägg till och stäng' }),
    )

    expect(onApply).toHaveBeenCalledWith({
      lan: [],
      kommuner: ['k-stockholm', 'k-nacka'],
      grouped: { 'Stockholms län': ['Stockholm', 'Nacka'] },
    })
  })

  it('selects all kommuner after "Välj alla län" without picking one county', async () => {
    const user = userEvent.setup()

    render(<GeographyFilter />)

    await user.click(screen.getByLabelText('Välj alla län'))
    await user.click(screen.getByLabelText('Välj alla kommuner'))

    expect(screen.getByLabelText('Stockholm')).toBeChecked()
    expect(screen.getByLabelText('Nacka')).toBeChecked()
    expect(screen.getByLabelText('Malmö')).toBeChecked()
  })
})
