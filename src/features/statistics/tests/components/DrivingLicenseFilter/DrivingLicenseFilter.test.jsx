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
  DigiFormCheckbox: ({ afLabel, afChecked, onAfOnChange }) => (
    <label>
      <input
        type="checkbox"
        aria-label={afLabel}
        checked={!!afChecked}
        onChange={onAfOnChange}
      />
      {afLabel}
    </label>
  ),
  DigiIconChevronDown: () => null,
  DigiIconLicenceCar: () => null,
  DigiIconX: () => null,
}))

describe('DrivingLicenseFilter', () => {
  it('notifies parent when a license option is checked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<DrivingLicenseFilter onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: /Körkort/ }))
    await user.click(screen.getByLabelText('Körkort efterfrågas'))

    expect(onChange).toHaveBeenCalledWith('required')
  })

  it('emits no filter when both options are checked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<DrivingLicenseFilter onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: /Körkort/ }))
    await user.click(screen.getByLabelText('Körkort efterfrågas'))
    await user.click(screen.getByLabelText('Körkort efterfrågas inte'))

    expect(onChange).toHaveBeenLastCalledWith('')
  })

  it('clears selection via Rensa', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<DrivingLicenseFilter onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: /Körkort/ }))
    await user.click(screen.getByLabelText('Körkort efterfrågas'))
    onChange.mockClear()

    await user.click(screen.getByRole('button', { name: 'Rensa alla' }))

    expect(onChange).toHaveBeenCalledWith('')
  })
})
