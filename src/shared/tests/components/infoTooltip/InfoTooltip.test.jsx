import { describe, expect, it, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import InfoTooltip from '../../../components/infoTooltip/InfoTooltip'

function getTrigger() {
  return document.querySelector('.info-tooltip__trigger')
}

describe('InfoTooltip', () => {
  afterEach(() => {
    vi.useRealTimers()
  })
  it('shows tooltip content when trigger is clicked', () => {
    render(
      <InfoTooltip label="Mer info">
        <span>Hjälptext</span>
      </InfoTooltip>,
    )

    fireEvent.click(getTrigger())

    expect(screen.getByRole('tooltip')).toHaveTextContent('Hjälptext')
  })

  it('opens on hover and closes when pointer leaves the component', () => {
    vi.useFakeTimers()
    render(
      <InfoTooltip label="Mer info">
        <span>Hjälptext</span>
      </InfoTooltip>,
    )

    fireEvent.mouseEnter(getTrigger())
    expect(screen.getByRole('tooltip')).toBeInTheDocument()

    fireEvent.mouseLeave(getTrigger())
    act(() => {
      vi.advanceTimersByTime(80)
    })

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('closes tooltip on Escape', () => {
    render(
      <InfoTooltip label="Mer info">
        <span>Hjälptext</span>
      </InfoTooltip>,
    )

    fireEvent.click(getTrigger())
    expect(screen.getByRole('tooltip')).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })
})
