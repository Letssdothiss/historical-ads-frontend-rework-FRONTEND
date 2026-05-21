import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Dropdown from '../../../components/dropdown/Dropdown'

describe('Dropdown', () => {
  it('shows panel when open and hides when closed', () => {
    const { rerender } = render(
      <Dropdown
        isOpen={false}
        trigger={<button type="button">Öppna</button>}
      >
        <p>Panelinnehåll</p>
      </Dropdown>,
    )

    expect(screen.queryByText('Panelinnehåll')).not.toBeInTheDocument()

    rerender(
      <Dropdown
        isOpen
        trigger={<button type="button">Öppna</button>}
      >
        <p>Panelinnehåll</p>
      </Dropdown>,
    )

    expect(screen.getByText('Panelinnehåll')).toBeInTheDocument()
  })

  it('calls onClose when clicking outside', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(
      <>
        <button type="button">Utanför</button>
        <Dropdown
          isOpen
          onClose={onClose}
          trigger={<button type="button">Öppna</button>}
        >
          <p>Inuti</p>
        </Dropdown>
      </>,
    )

    await user.click(screen.getByRole('button', { name: 'Utanför' }))
    expect(onClose).toHaveBeenCalledOnce()
  })
})
