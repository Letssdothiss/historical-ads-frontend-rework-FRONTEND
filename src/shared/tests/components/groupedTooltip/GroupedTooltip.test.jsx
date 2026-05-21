import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import GroupedTooltip from '../../../components/groupedTooltip/GroupedTooltip'

describe('GroupedTooltip', () => {
  it('renders nothing when grouped is empty', () => {
    const { container } = render(
      <GroupedTooltip title="Geografi" grouped={{}} />,
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('renders grouped items by category', () => {
    render(
      <GroupedTooltip
        title="Geografi"
        grouped={{
          'Stockholms län': ['Stockholm', 'Nacka'],
          'Skåne län': ['Malmö'],
        }}
      />,
    )

    expect(screen.getByText('Geografi')).toBeInTheDocument()
    expect(screen.getByText('Stockholms län')).toBeInTheDocument()
    expect(screen.getByText('Stockholm')).toBeInTheDocument()
    expect(screen.getByText('Malmö')).toBeInTheDocument()
  })
})
