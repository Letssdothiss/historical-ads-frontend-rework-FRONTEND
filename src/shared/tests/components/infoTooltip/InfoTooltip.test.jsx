import { describe, expect, it } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import InfoTooltip from '../../../components/infoTooltip/InfoTooltip'

function getTrigger() {
  return document.querySelector('.info-tooltip__trigger')
}

describe('InfoTooltip', () => {
  it('shows tooltip content when trigger is clicked', () => {
    render(
      <InfoTooltip label="Mer info">
        <span>Hjälptext</span>
      </InfoTooltip>,
    )

    fireEvent.click(getTrigger())

    expect(screen.getByRole('tooltip')).toHaveTextContent('Hjälptext')
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
