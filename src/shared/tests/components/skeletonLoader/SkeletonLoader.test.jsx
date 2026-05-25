import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import SkeletonLoader from '../../../components/skeletonLoader/SkeletonLoader'

describe('SkeletonLoader', () => {
  it('renders accessible loading placeholder', () => {
    render(<SkeletonLoader />)

    expect(screen.getByLabelText('Laddar innehåll')).toBeInTheDocument()
  })
})
