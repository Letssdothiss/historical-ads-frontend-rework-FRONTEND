import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import CompetencySearch from '../../../components/competencySearch/CompetencySearch'

vi.mock('@designsystem-se/af-react', () => ({
  DigiFormInput: ({ afValue, onAfOnInput, afLabel }) => (
    <input
      aria-label={afLabel}
      value={afValue ?? ''}
      onChange={(e) =>
        onAfOnInput?.({ detail: { target: { value: e.target.value } } })
      }
    />
  ),
}))

vi.mock('../../../components/infoTooltip/InfoTooltip', () => ({
  default: ({ children }) => <span>{children}</span>,
}))

describe('CompetencySearch', () => {
  it('calls onChange when the search field changes', () => {
    const onChange = vi.fn()

    render(<CompetencySearch value="" onChange={onChange} />)

    fireEvent.change(screen.getByLabelText('Sök på kompetenser'), {
      target: { value: 'react' },
    })

    expect(onChange).toHaveBeenCalledWith('react')
  })
})
