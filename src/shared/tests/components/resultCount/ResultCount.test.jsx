import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import ResultCount from '../../../components/resultCount/ResultCount'

describe('ResultCount', () => {
  it('renders the count in the summary text', () => {
    render(<ResultCount count={1234} />)

    expect(
      screen.getByText(
        'Totalt 1234 annonser i valt geografiskt område under vald tidsperiod',
      ),
    ).toBeInTheDocument()
  })
})
