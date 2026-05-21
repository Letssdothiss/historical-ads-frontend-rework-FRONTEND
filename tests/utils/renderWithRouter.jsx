import { render } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

/**
 * Render a page component at a specific URL (path + query string).
 */
export function renderPageAtRoute(Page, { route, path }) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path={path} element={<Page />} />
      </Routes>
    </MemoryRouter>,
  )
}
