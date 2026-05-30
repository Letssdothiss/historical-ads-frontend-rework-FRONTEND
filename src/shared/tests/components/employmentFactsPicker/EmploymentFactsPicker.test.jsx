import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EmploymentFactsPicker from '../../../components/employmentFactsPicker/EmploymentFactsPicker'

vi.mock('@designsystem-se/af-react', () => ({
  DigiButton: ({ children, onAfOnClick }) => (
    <button type="button" onClick={onAfOnClick}>
      {children}
    </button>
  ),
  DigiIconChevronDown: () => null,
  DigiIconChevronRight: () => null,
  DigiIconX: () => null,
}))

describe('EmploymentFactsPicker', () => {
  it('opens picker and notifies parent when an option is selected', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<EmploymentFactsPicker onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: /Fakta anställning/ }))
    await user.click(screen.getByLabelText('Tillsvidare eller visstid'))

    expect(onChange).toHaveBeenCalledWith({
      type: ['kpPX_CNN_gDU,sTu5_NBQ_udq'],
      duration: [],
      scope: [],
    })
  })

  it('clears all selections via Rensa alla', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <EmploymentFactsPicker
        value={{ type: ['kpPX_CNN_gDU,sTu5_NBQ_udq'], duration: [], scope: [] }}
        onChange={onChange}
      />,
    )

    await user.click(screen.getByRole('button', { name: /Fakta anställning/ }))
    await user.click(screen.getByRole('button', { name: 'Rensa alla' }))

    expect(onChange).toHaveBeenCalledWith({
      type: [],
      duration: [],
      scope: [],
    })
  })
})
