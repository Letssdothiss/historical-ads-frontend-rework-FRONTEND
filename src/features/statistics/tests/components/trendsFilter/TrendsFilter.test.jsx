import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TrendsFilter from '../../../components/trendsFilter/TrendsFilter'

vi.mock('@designsystem-se/af-react', () => ({
  DigiButton: ({ children, onAfOnClick }) => (
    <button type="button" onClick={onAfOnClick}>
      {children}
    </button>
  ),
  DigiIconChart: () => null,
  DigiIconChevronDown: () => null,
}))

describe('TrendsFilter', () => {
  it('opens dropdown and selects a trend', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<TrendsFilter value="" onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: /Trender/ }))
    await user.click(
      screen.getByRole('button', { name: '5 vanligaste yrkesgrupperna' }),
    )

    expect(onChange).toHaveBeenCalledWith('top5_occupations')
  })

  it('clears selection when the same trend is chosen again', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <TrendsFilter value="top5_skills" onChange={onChange} />,
    )

    await user.click(screen.getByRole('button', { name: /Trender/ }))
    await user.click(
      screen.getByRole('button', { name: '5 vanligaste kompetenserna' }),
    )

    expect(onChange).toHaveBeenCalledWith('')
  })
})
