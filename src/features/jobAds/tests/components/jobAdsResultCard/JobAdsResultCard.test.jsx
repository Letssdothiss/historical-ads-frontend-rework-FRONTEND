import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import JobAdsResultCard from '../../../components/jobAdsResultCard/JobAdsResultCard'

vi.mock('@designsystem-se/af-react', () => ({
  DigiCard: ({ children }) => <div data-testid="digi-card">{children}</div>,
  DigiButton: ({ children, onAfOnClick }) => (
    <button type="button" onClick={onAfOnClick}>
      {children}
    </button>
  ),
}))

const sampleAd = {
  id: 'job-1',
  originalId: '30429400',
  title: 'Testtitel',
  employer: 'Testföretag',
  occupation: 'Yrke',
  municipality: 'Växjö',
  raw: {
    publication_date: '2026-01-15',
  },
}

describe('JobAdsResultCard', () => {
  it('renders ad fields and placeholder for missing values', () => {
    render(<JobAdsResultCard ad={sampleAd} />)

    expect(
      screen.getByRole('heading', { name: 'Testtitel' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Annons-ID: 30429400')).toBeInTheDocument()
    expect(screen.getByText('Testföretag')).toBeInTheDocument()
    expect(screen.getByText('Växjö')).toBeInTheDocument()
    expect(screen.getByText('15 januari 2026')).toBeInTheDocument()
  })

  it('calls onViewAd when Till annons is clicked', async () => {
    const user = userEvent.setup()
    const onViewAd = vi.fn()

    render(<JobAdsResultCard ad={sampleAd} onViewAd={onViewAd} />)

    await user.click(screen.getByRole('button', { name: 'Till annons' }))

    expect(onViewAd).toHaveBeenCalledWith(sampleAd)
  })

  it('shows Okänt for empty title', () => {
    render(<JobAdsResultCard ad={{ ...sampleAd, title: '   ' }} />)

    expect(screen.getByRole('heading', { name: 'Okänt' })).toBeInTheDocument()
  })
})
