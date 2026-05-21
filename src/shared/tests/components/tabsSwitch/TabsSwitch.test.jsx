import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import TabsSwitch from '../../../components/tabsSwitch/TabsSwitch'

function renderTabs(initialPath = '/platsannonser') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <TabsSwitch />
    </MemoryRouter>,
  )
}

describe('TabsSwitch', () => {
  it('renders main navigation links', () => {
    renderTabs()

    expect(screen.getByRole('navigation', { name: 'Huvudnavigering' }))
      .toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Platsannonser' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Statistik' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Om datan' })).toBeInTheDocument()
  })

  it('marks the active tab based on the current path', () => {
    renderTabs('/statistik/resultat')

    expect(screen.getByRole('link', { name: 'Statistik' })).toHaveClass(
      'tabs-switch__link--active',
    )
    expect(screen.getByRole('link', { name: 'Platsannonser' })).not.toHaveClass(
      'tabs-switch__link--active',
    )
  })
})
