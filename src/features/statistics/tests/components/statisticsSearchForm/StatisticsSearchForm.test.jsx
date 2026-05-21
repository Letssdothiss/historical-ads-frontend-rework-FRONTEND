import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import StatisticsSearchForm from '../../../components/statisticsSearchForm/StatisticsSearchForm'

const navigate = vi.fn()

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: () => navigate,
  }
})

vi.mock('@designsystem-se/af-react', () => ({
  DigiButton: ({ children, onAfOnClick, afType }) => (
    <button type={afType === 'submit' ? 'submit' : 'button'} onClick={onAfOnClick}>
      {children}
    </button>
  ),
  DigiFormInput: ({ afValue, onAfOnInput, afId, afLabel }) => (
    <input
      id={afId}
      aria-label={afLabel}
      value={afValue ?? ''}
      onChange={(e) =>
        onAfOnInput?.({ detail: { target: { value: e.target.value } } })
      }
    />
  ),
  DigiIconChevronDown: () => null,
  DigiIconGlobeFilled: () => null,
  DigiIconUserAlt: () => null,
}))

vi.mock('../../../../../shared/components/competencySearch/CompetencySearch', () => ({
  default: ({ onChange }) => (
    <input
      aria-label="Kompetenser"
      onChange={(e) => onChange?.(e.target.value)}
    />
  ),
}))
vi.mock('../../../../../shared/components/employmentFactsPicker/EmploymentFactsPicker', () => ({
  default: () => null,
}))
vi.mock('../../../../../shared/components/geographyFilter/GeographyFilter', () => ({
  default: () => null,
}))
vi.mock('../../../../../shared/components/infoTooltip/InfoTooltip', () => ({
  default: () => null,
}))
vi.mock('../../../../../shared/components/timePeriodFilter/TimePeriodFilter', () => ({
  default: () => null,
}))
vi.mock('../../../../../jobAds/components/jobGroupFilter/JobGroupFilter', () => ({
  default: () => null,
}))
vi.mock('../../../components/DrivingLicenseFilter/DrivingLicenseFilter', () => ({
  default: ({ onChange }) => (
    <button type="button" onClick={() => onChange?.('required')}>
      Mock körkort
    </button>
  ),
}))
vi.mock('../../../components/trendsFilter/TrendsFilter', () => ({
  default: ({ onChange }) => (
    <button type="button" onClick={() => onChange?.('top5_skills')}>
      Mock trender
    </button>
  ),
}))

function renderForm() {
  return render(
    <MemoryRouter>
      <StatisticsSearchForm />
    </MemoryRouter>,
  )
}

describe('StatisticsSearchForm', () => {
  beforeEach(() => {
    navigate.mockReset()
  })

  it('renders the statistics search form', () => {
    renderForm()

    expect(
      screen.getByLabelText('Sök på ord i annons och titel'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sök' })).toBeInTheDocument()
  })

  it('navigates to results with query params on submit', async () => {
    const user = userEvent.setup()
    renderForm()

    await user.type(
      screen.getByLabelText('Sök på ord i annons och titel'),
      'data',
    )
    await user.click(screen.getByRole('button', { name: 'Mock trender' }))
    await user.click(screen.getByRole('button', { name: 'Mock körkort' }))
    await user.click(screen.getByRole('button', { name: 'Sök' }))

    expect(navigate).toHaveBeenCalledWith({
      pathname: '/statistik/resultat',
      search: 'q=data&trend=top5_skills&korkort=required',
    })
  })
})
