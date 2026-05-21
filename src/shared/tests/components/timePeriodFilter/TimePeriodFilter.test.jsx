import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TimePeriodFilter from '../../../components/timePeriodFilter/TimePeriodFilter'

vi.mock('@designsystem-se/af-react', () => ({
  DigiButton: ({ children, onAfOnClick }) => (
    <button type="button" onClick={onAfOnClick}>
      {children}
    </button>
  ),
  DigiFormCheckbox: ({ afLabel, onAfOnChange }) => (
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
  DigiIconChevronDown: () => null,
  DigiIconChevronRight: () => null,
  DigiIconClock: () => null,
  DigiIconX: () => null,
}))

describe('TimePeriodFilter', () => {
  it('notifies parent when a year is selected', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<TimePeriodFilter onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: /Tidsperiod/ }))
    await user.click(screen.getByText('2024'))

    await waitFor(() =>
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ years: ['2024'] }),
      ),
    )
  })
})
