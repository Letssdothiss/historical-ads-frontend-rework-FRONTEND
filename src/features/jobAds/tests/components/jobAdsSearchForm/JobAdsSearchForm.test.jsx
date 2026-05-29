import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import JobAdsSearchForm from '../../../components/jobAdsSearchForm/JobAdsSearchForm'

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
    <button
      type={afType === 'submit' ? 'submit' : 'button'}
      onClick={onAfOnClick}
    >
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

vi.mock(
  '../../../../../shared/components/competencySearch/CompetencySearch',
  () => ({
    default: () => null,
  }),
)
vi.mock(
  '../../../../../shared/components/employmentFactsPicker/EmploymentFactsPicker',
  () => ({
    default: () => null,
  }),
)
vi.mock(
  '../../../../../shared/components/geographyFilter/GeographyFilter',
  () => ({
    default: () => null,
  }),
)
vi.mock('../../../../../shared/components/infoTooltip/InfoTooltip', () => ({
  default: () => null,
}))
vi.mock(
  '../../../../../shared/components/timePeriodFilter/TimePeriodFilter',
  () => ({
    default: () => null,
  }),
)
vi.mock(
  '../../../../../shared/components/jobGroupFilter/JobGroupFilter',
  () => ({
    default: () => null,
  }),
)

function renderForm() {
  return render(
    <MemoryRouter>
      <JobAdsSearchForm />
    </MemoryRouter>,
  )
}

describe('JobAdsSearchForm', () => {
  beforeEach(() => {
    navigate.mockReset()
  })

  it('renders the search form', () => {
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
      'react',
    )
    await user.click(screen.getByRole('button', { name: 'Sök' }))

    expect(navigate).toHaveBeenCalledWith({
      pathname: '/platsannonser/resultat',
      search: 'q=react',
    })
  })

  it('hydrates form fields from URL search params on results route', () => {
    render(
      <MemoryRouter
        initialEntries={['/platsannonser/resultat?q=react&employer=Acme']}
      >
        <Routes>
          <Route
            path="/platsannonser/resultat"
            element={<JobAdsSearchForm />}
          />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByLabelText('Sök på ord i annons och titel')).toHaveValue(
      'react',
    )
    expect(screen.getByLabelText('Arbetsgivarens namn')).toHaveValue('Acme')
  })

  it('navigates with organization number when org type is selected', async () => {
    const user = userEvent.setup()
    renderForm()

    await user.click(screen.getByRole('radio', { name: 'Organisationsnummer' }))
    await user.type(
      screen.getByRole('textbox', { name: 'Organisationsnummer' }),
      '556677-8899',
    )
    await user.click(screen.getByRole('button', { name: 'Sök' }))

    expect(navigate).toHaveBeenCalledWith({
      pathname: '/platsannonser/resultat',
      search: 'organization_number=556677-8899',
    })
  })
})
