import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DrivingLicenseFilter from '../../../components/DrivingLicenseFilter/DrivingLicenseFilter'

vi.mock('@designsystem-se/af-react', () => ({
  DigiButton: ({ children, onAfOnClick }) => (
    <button type="button" onClick={onAfOnClick}>
      {children}
    </button>
  ),
  DigiFormRadiogroup: ({ children }) => <div role="radiogroup">{children}</div>,
  DigiFormRadiobutton: ({ afLabel, onAfOnChange }) => (
    <label>
      <input type="radio" aria-label={afLabel} onChange={onAfOnChange} />
      {afLabel}
    </label>
  ),
  DigiIconChevronDown: () => null,
  DigiIconLicenceCar: () => null,
  DigiIconX: () => null,
}))

describe('DrivingLicenseFilter', () => {
  it('notifies parent when a license option is selected', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<DrivingLicenseFilter onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: /Körkort/ }))
    await user.click(screen.getByLabelText('Körkort efterfrågas'))

    expect(onChange).toHaveBeenCalledWith('required')
  })

  it('clears selection via Rensa', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<DrivingLicenseFilter onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: /Körkort/ }))
    await user.click(screen.getByLabelText('Körkort efterfrågas'))
    onChange.mockClear()

    await user.click(screen.getByRole('button', { name: 'Rensa' }))

    expect(onChange).toHaveBeenCalledWith('')
  })
})
