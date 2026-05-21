import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import ContentWrapper from '../../../components/contentWrapper/ContentWrapper'

const navigate = vi.fn()

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: () => navigate,
  }
})

vi.mock('../../../components/tabsSwitch/TabsSwitch', () => ({
  default: () => <nav data-testid="tabs-switch" />,
}))

function renderWrapper(path = '/platsannonser', props = {}) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ContentWrapper {...props}>
        <p>Formulärinnehåll</p>
      </ContentWrapper>
    </MemoryRouter>,
  )
}

describe('ContentWrapper', () => {
  beforeEach(() => {
    navigate.mockReset()
  })

  it('renders shell content and children', () => {
    renderWrapper()

    expect(
      screen.getByRole('heading', { name: 'Historiska platsannonser' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Formulärinnehåll')).toBeInTheDocument()
    expect(screen.getByTestId('tabs-switch')).toBeInTheDocument()
  })

  it('navigates to job ads when Rensa is clicked on platsannonser', async () => {
    const user = userEvent.setup()
    const onReset = vi.fn()

    renderWrapper('/platsannonser/resultat', { onReset })

    await user.click(screen.getByRole('button', { name: 'Rensa' }))

    expect(onReset).toHaveBeenCalledOnce()
    expect(navigate).toHaveBeenCalledWith('/platsannonser', { replace: true })
  })

  it('navigates to statistics when Rensa is clicked on statistik path', async () => {
    const user = userEvent.setup()

    renderWrapper('/statistik/resultat')

    await user.click(screen.getByRole('button', { name: 'Rensa' }))

    expect(navigate).toHaveBeenCalledWith('/statistik', { replace: true })
  })

  it('keeps Rensa in DOM but hidden when hideRensaLink is true', () => {
    const { container } = renderWrapper('/platsannonser/resultat', {
      hideRensaLink: true,
    })

    const resetButton = container.querySelector('.shell-reset-link')
    expect(resetButton).toHaveClass('shell-reset-link--hidden')
    expect(resetButton).toHaveAttribute('aria-hidden', 'true')
    expect(resetButton).toHaveAttribute('tabindex', '-1')
  })
})
