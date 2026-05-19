import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import JobAdsResultsList from '../../../components/jobAdsResultsList/JobAdsResultsList'

vi.mock('@designsystem-se/af-react', () => ({
  DigiButton: ({ children, onAfOnClick }) => (
    <button type="button" onClick={onAfOnClick}>
      {children}
    </button>
  ),
}))

vi.mock('../../../components/jobAdsResultCard/JobAdsResultCard', () => ({
  default: ({ ad, onViewAd }) => (
    <button type="button" onClick={onViewAd}>
      {ad.title}
    </button>
  ),
}))

const sampleAds = [
  { id: '1', title: 'Annons A' },
  { id: '2', title: 'Annons B' },
]

describe('JobAdsResultsList', () => {
  it('shows loading message', () => {
    render(<JobAdsResultsList ads={[]} isLoading />)

    expect(screen.getByText('Söker annonser...')).toBeInTheDocument()
  })

  it('shows error message and retry button', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()

    render(
      <JobAdsResultsList
        ads={[]}
        isError
        error={{ message: 'Nätverksfel' }}
        onRetry={onRetry}
      />,
    )

    expect(screen.getByText('Nätverksfel')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Försök igen' }))
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('shows default error message when error object is missing', () => {
    render(<JobAdsResultsList ads={[]} isError />)

    expect(screen.getByText('Något gick fel.')).toBeInTheDocument()
  })

  it('shows empty state when there are no ads', () => {
    render(<JobAdsResultsList ads={[]} />)

    expect(
      screen.getByText('Inga annonser hittades. Prova att ändra sökkriterier.'),
    ).toBeInTheDocument()
  })

  it('renders ads and forwards onViewAd with index', async () => {
    const user = userEvent.setup()
    const onViewAd = vi.fn()

    render(
      <JobAdsResultsList ads={sampleAds} onViewAd={onViewAd} />,
    )

    expect(screen.getByRole('list', { name: 'Sökresultat' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Annons B' }))
    expect(onViewAd).toHaveBeenCalledWith(sampleAds[1], 1)
  })
})
