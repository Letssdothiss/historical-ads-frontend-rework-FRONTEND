import { forwardRef, useImperativeHandle } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import JobAdsPagination from '../../../components/jobAdsPagination/JobAdsPagination'

const afMSetCurrentPage = vi.fn()

vi.mock('@designsystem-se/af-react', () => ({
  DigiNavigationPagination: forwardRef(function MockPagination(
    { onAfOnPageChange },
    ref,
  ) {
    useImperativeHandle(ref, () => ({ afMSetCurrentPage }))
    return (
      <button type="button" onClick={() => onAfOnPageChange?.({ detail: 3 })}>
        Gå till sida 3
      </button>
    )
  }),
}))

describe('JobAdsPagination', () => {
  it('renders nothing when there is only one page', () => {
    const { container } = render(
      <JobAdsPagination currentPage={1} totalPages={1} totalResults={10} />,
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('renders pagination when totalPages is at least 2', () => {
    render(
      <JobAdsPagination
        currentPage={1}
        totalPages={5}
        totalResults={80}
        pageSize={20}
      />,
    )

    expect(
      screen.getByRole('button', { name: 'Gå till sida 3' }),
    ).toBeInTheDocument()
    expect(afMSetCurrentPage).toHaveBeenCalledWith(1)
  })

  it('calls onPageChange with page from the design system event', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()

    render(
      <JobAdsPagination
        currentPage={1}
        totalPages={4}
        onPageChange={onPageChange}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Gå till sida 3' }))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })
})
