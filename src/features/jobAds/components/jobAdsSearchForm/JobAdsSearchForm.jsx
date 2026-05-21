import {
  ButtonSize,
  ButtonType,
  ButtonVariation,
  FormInputType,
  FormInputValidation,
  FormInputVariation,
} from '@designsystem-se/af'
import {
  DigiButton,
  DigiFormInput,
  DigiIconChevronDown,
  DigiIconGlobeFilled,
  DigiIconUserAlt,
} from '@designsystem-se/af-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CompetencySearch from '../../../../shared/components/competencySearch/CompetencySearch'
import Dropdown from '../../../../shared/components/dropdown/Dropdown'
import GroupedTooltip from '../../../../shared/components/groupedTooltip/GroupedTooltip'
import EmploymentFactsPicker from '../../../../shared/components/employmentFactsPicker/EmploymentFactsPicker'
import GeographyFilter from '../../../../shared/components/geographyFilter/GeographyFilter'
import InfoTooltip from '../../../../shared/components/infoTooltip/InfoTooltip'
import TimePeriodFilter from '../../../../shared/components/timePeriodFilter/TimePeriodFilter'
import JobGroupFilter from '../jobGroupFilter/JobGroupFilter'
import './JobAdsSearchForm.css'

export default function JobAdsSearchForm() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [geoOpen, setGeoOpen] = useState(false)
  const [jobOpen, setJobOpen] = useState(false)
  const [geoHover, setGeoHover] = useState(false)
  const [jobHover, setJobHover] = useState(false)
  const [geography, setGeography] = useState({
    lan: [],
    kommuner: [],
    grouped: {},
  })
  const [occupations, setOccupations] = useState({
    areas: [],
    groups: [],
    grouped: {},
  })
  const [timePeriod, setTimePeriod] = useState({ years: [], months: [] })
  const [employment, setEmployment] = useState({
    type: [],
    duration: [],
    scope: [],
  })
  const [employerType, setEmployerType] = useState('name')
  const [employer, setEmployer] = useState('')
  const [organizationNumber, setOrganizationNumber] = useState('')
  const [skills, setSkills] = useState('')

  const hasGeoSelection =
    geography.lan.length > 0 || geography.kommuner.length > 0
  const hasJobSelection =
    occupations.areas.length > 0 || occupations.groups.length > 0

  const handleSubmit = (event) => {
    event.preventDefault()
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    geography.lan.forEach((l) => params.append('lan', l))
    geography.kommuner.forEach((k) => params.append('kommun', k))
    occupations.areas.forEach((a) => params.append('yrkesomrade', a))
    occupations.groups.forEach((g) => params.append('yrkesgrupp', g))
    timePeriod.years.forEach((y) => params.append('years', y))
    timePeriod.months.forEach((m) => params.append('months', m))
    employment.type.forEach((t) => params.append('employment_type', t))
    employment.duration.forEach((d) => params.append('duration', d))
    employment.scope.forEach((s) => params.append('working_hours_type', s))
    if (employerType === 'name' && employer.trim()) {
      params.set('employer', employer.trim())
    } else if (employerType === 'org' && organizationNumber.trim()) {
      params.set('organization_number', organizationNumber.trim())
    }
    skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((skill) => params.append('skills', skill))

    navigate({ pathname: '/platsannonser/resultat', search: params.toString() })
  }

  const geoLabel = 'Geografiskt område'
  const jobLabel = 'Yrkesgrupper'

  return (
    <form className="job-ads-search-form" onSubmit={handleSubmit}>
      <div className="job-ads-search-form__free-text">
        <div className="job-ads-search-form__field-label">
          <label htmlFor="free-text-search-input-field">
            Sök på ord i annons och titel
          </label>
          <InfoTooltip label="Information om fritextsökning">
            Det här sökfältet gör det möjligt att göra en fritextsökning bland
            samtliga kategorier i annonstexten.
          </InfoTooltip>
        </div>
        <DigiFormInput
          afId="free-text-search-input-field"
          afLabel="Sök på ord i annons och titel"
          afLabelDescription="Söker i titel, beskrivning och arbetsgivarens namn"
          afVariation={FormInputVariation.MEDIUM}
          afType={FormInputType.TEXT}
          afValidation={FormInputValidation.NEUTRAL}
          afValue={q}
          afPlaceholder="Sök på ord"
          onAfOnInput={(event) => setQ(event.detail.target.value)}
        />
      </div>

      <div className="job-ads-search-form__filters">
        <Dropdown
          isOpen={geoOpen}
          onClose={() => setGeoOpen(false)}
          trigger={
            <div
              className="job-ads-search-form__trigger-wrapper"
              onMouseEnter={() => setGeoHover(true)}
              onMouseLeave={() => setGeoHover(false)}
            >
              <DigiButton
                afVariation={ButtonVariation.SECONDARY}
                afSize={ButtonSize.MEDIUM}
                afFullWidth
                onAfOnClick={() => setGeoOpen((open) => !open)}
              >
                <div className="job-ads-search-form__filter-trigger">
                  <DigiIconGlobeFilled />
                  <span>{geoLabel}</span>
                  <DigiIconChevronDown />
                  {hasGeoSelection && (
                    <span
                      className="job-ads-search-form__trigger-dot"
                      aria-hidden="true"
                    />
                  )}
                </div>
              </DigiButton>
              {geoHover && hasGeoSelection && (
                <GroupedTooltip
                  title="Valda kommuner"
                  grouped={geography.grouped}
                />
              )}
            </div>
          }
        >
          <GeographyFilter
            onClose={() => setGeoOpen(false)}
            initialLan={geography.lan}
            initialKommuner={geography.kommuner}
            onApply={({ lan, kommuner, grouped }) =>
              setGeography({
                lan: lan ?? [],
                kommuner: kommuner ?? [],
                grouped: grouped ?? {},
              })
            }
          />
        </Dropdown>

        <div className="job-ads-search-form__filter-cell">
          <TimePeriodFilter onChange={setTimePeriod} />
        </div>

        <Dropdown
          isOpen={jobOpen}
          onClose={() => setJobOpen(false)}
          trigger={
            <div
              className="job-ads-search-form__trigger-wrapper"
              onMouseEnter={() => setJobHover(true)}
              onMouseLeave={() => setJobHover(false)}
            >
              <DigiButton
                afVariation={ButtonVariation.SECONDARY}
                afSize={ButtonSize.MEDIUM}
                afFullWidth
                onAfOnClick={() => setJobOpen((open) => !open)}
              >
                <div className="job-ads-search-form__filter-trigger">
                  <DigiIconUserAlt />
                  <span>{jobLabel}</span>
                  <DigiIconChevronDown />
                  {hasJobSelection && (
                    <span
                      className="job-ads-search-form__trigger-dot"
                      aria-hidden="true"
                    />
                  )}
                </div>
              </DigiButton>
              {jobHover && hasJobSelection && (
                <GroupedTooltip
                  title="Valda yrkesgrupper"
                  grouped={occupations.grouped}
                />
              )}
            </div>
          }
        >
          <JobGroupFilter
            onClose={() => setJobOpen(false)}
            initialAreas={occupations.areas}
            initialGroups={occupations.groups}
            onApply={({ areas, groups, grouped }) =>
              setOccupations({
                areas: areas ?? [],
                groups: groups ?? [],
                grouped: grouped ?? {},
              })
            }
          />
        </Dropdown>

        <div className="job-ads-search-form__filter-cell">
          <EmploymentFactsPicker value={employment} onChange={setEmployment} />
        </div>
      </div>

      <div className="job-ads-search-form__inputs">
        <div className="job-ads-search-form__input-block">
          <label
            className="job-ads-search-form__field-label"
            htmlFor="employer-input-field"
          >
            Arbetsgivare
          </label>
          {employerType === 'name' ? (
            <DigiFormInput
              afId="employer-input-field"
              afLabel="Arbetsgivarens namn"
              afVariation={FormInputVariation.MEDIUM}
              afType={FormInputType.TEXT}
              afValidation={FormInputValidation.NEUTRAL}
              afPlaceholder="Skriv här"
              afValue={employer}
              onAfOnInput={(event) => setEmployer(event.detail.target.value)}
            />
          ) : (
            <DigiFormInput
              afId="employer-input-field"
              afLabel="Organisationsnummer"
              afVariation={FormInputVariation.MEDIUM}
              afType={FormInputType.TEXT}
              afValidation={FormInputValidation.NEUTRAL}
              afPlaceholder="Skriv organisationsnummer"
              afValue={organizationNumber}
              onAfOnInput={(event) =>
                setOrganizationNumber(event.detail.target.value)
              }
            />
          )}
          <div className="job-ads-search-form__radio-group" role="radiogroup">
            <label className="job-ads-search-form__radio">
              <input
                type="radio"
                name="employer-type"
                value="name"
                checked={employerType === 'name'}
                onChange={() => setEmployerType('name')}
              />
              <span>Namn</span>
            </label>
            <label className="job-ads-search-form__radio">
              <input
                type="radio"
                name="employer-type"
                value="org"
                checked={employerType === 'org'}
                onChange={() => setEmployerType('org')}
              />
              <span>Organisationsnummer</span>
            </label>
          </div>
        </div>

        <div className="job-ads-search-form__input-block">
          <CompetencySearch value={skills} onChange={setSkills} />
        </div>
      </div>

      <div className="job-ads-search-form__actions">
        <DigiButton
          afId="job-ads-search-button"
          afSize={ButtonSize.MEDIUM}
          afVariation={ButtonVariation.PRIMARY}
          afType={ButtonType.SUBMIT}
          afFullWidth
        >
          Sök
        </DigiButton>
      </div>
    </form>
  )
}
