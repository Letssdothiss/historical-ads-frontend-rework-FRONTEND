import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom'
import ScrollToTop from '../../../components/scrollToTop/ScrollToTop'

function NavigationHarness() {
  const navigate = useNavigate()
  return (
    <>
      <ScrollToTop />
      <button type="button" onClick={() => navigate('/platsannonser/resultat')}>
        Till resultat
      </button>
      <button type="button" onClick={() => navigate('/statistik')}>
        Till statistik
      </button>
    </>
  )
}

describe('ScrollToTop', () => {
  beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  })

  it('does not scroll when navigating within the same tab section', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/platsannonser']}>
        <Routes>
          <Route path="*" element={<NavigationHarness />} />
        </Routes>
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: 'Till resultat' }))
    expect(window.scrollTo).not.toHaveBeenCalled()
  })

  it('scrolls to top when switching main tab sections', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/platsannonser']}>
        <Routes>
          <Route path="*" element={<NavigationHarness />} />
        </Routes>
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: 'Till statistik' }))
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
  })
})
