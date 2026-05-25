import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FilterIndicator from '../../../components/filterIndicator/FilterIndicator'

describe('FilterIndicator', () => {
  it('renders nothing when all groups are empty', () => {
    const { container } = render(
      <FilterIndicator heading="Val" groups={[{ label: 'Län', items: [] }]} />,
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('shows popup content on hover when filters are selected', async () => {
    const user = userEvent.setup()

    render(
      <FilterIndicator
        heading="Geografi"
        groups={[
          { label: 'Län', items: ['Stockholms län'] },
          { label: 'Kommun', items: [] },
        ]}
      />,
    )

    await user.hover(
      screen.getByRole('status', { name: 'Visa valda alternativ' }),
    )

    expect(screen.getByRole('tooltip')).toBeInTheDocument()
    expect(screen.getByText('Geografi')).toBeInTheDocument()
    expect(screen.getByText('Stockholms län')).toBeInTheDocument()
  })
})
