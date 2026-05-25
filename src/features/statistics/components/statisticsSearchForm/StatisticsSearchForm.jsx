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
  DigiIconChevronUp,
  DigiIconGlobeFilled,
  DigiIconUserAlt,
} from '@designsystem-se/af-react'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  geographyFilterKey,
  jobGroupFilterKey,
  parseStatisticsSearchFormState,
} from '../../../../shared/utils/searchFormParams'
import CompetencySearch from '../../../../shared/components/competencySearch/CompetencySearch'
import Dropdown from '../../../../shared/components/dropdown/Dropdown'
import GroupedTooltip from '../../../../shared/components/groupedTooltip/GroupedTooltip'
import EmploymentFactsPicker from '../../../../shared/components/employmentFactsPicker/EmploymentFactsPicker'
import GeographyFilter from '../../../../shared/components/geographyFilter/GeographyFilter'
import InfoTooltip from '../../../../shared/components/infoTooltip/InfoTooltip'
import TimePeriodFilter from '../../../../shared/components/timePeriodFilter/TimePeriodFilter'
import JobGroupFilter from '../../../../shared/components/jobGroupFilter/JobGroupFilter'
import DrivingLicenseFilter from '../DrivingLicenseFilter/DrivingLicenseFilter'
import TrendsFilter from '../trendsFilter/TrendsFilter'
import './StatisticsSearchForm.css'

export default function StatisticsSearchForm() {
  const [searchParams] = useSearchParams()
  return (
    <StatisticsSearchFormFields
      key={searchParams.toString()}
      searchParams={searchParams}
    />
  )
}

function StatisticsSearchFormFields({ searchParams }) {
  const navigate = useNavigate()
  const initial = parseStatisticsSearchFormState(searchParams)
  const [q, setQ] = useState(initial.q)
  const [trend, setTrend] = useState(initial.trend)
  const [drivingLicense, setDrivingLicense] = useState(initial.drivingLicense)
  const [geoOpen, setGeoOpen] = useState(false)
  const [jobOpen, setJobOpen] = useState(false)
  const [geoHover, setGeoHover] = useState(false)
  const [jobHover, setJobHover] = useState(false)
  const [geography, setGeography] = useState(initial.geography)
  const [occupations, setOccupations] = useState(initial.occupations)
  const [timePeriod, setTimePeriod] = useState(initial.timePeriod)
  const [employment, setEmployment] = useState(initial.employment)
  const [skills, setSkills] = useState(initial.skills)

  const hasGeoSelection =
    geography.lan.length > 0 || geography.kommuner.length > 0
  const hasJobSelection =
    occupations.areas.length > 0 || occupations.groups.length > 0

  const handleSubmit = (event) => {
    event.preventDefault()
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    if (trend) params.set('trend', trend)
    if (drivingLicense) params.set('korkort', drivingLicense)
    geography.lan.forEach((l) => params.append('lan', l))
    geography.kommuner.forEach((k) => params.append('kommun', k))
    if (Object.keys(geography.grouped).length) {
      params.set('kommun-labels', JSON.stringify(geography.grouped))
    }
    occupations.areas.forEach((a) => params.append('yrkesomrade', a))
    occupations.groups.forEach((g) => params.append('yrkesgrupp', g))
    if (Object.keys(occupations.grouped).length) {
      params.set('yrkesgrupp-labels', JSON.stringify(occupations.grouped))
    }
    timePeriod.years.forEach((y) => params.append('years', y))
    timePeriod.months.forEach((m) => params.append('months', m))
    employment.type.forEach((t) => params.append('employment_type', t))
    employment.duration.forEach((d) => params.append('duration', d))
    employment.scope.forEach((s) => params.append('working_hours_type', s))
    skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((skill) => params.append('skills', skill))

    navigate({ pathname: '/statistik/resultat', search: params.toString() })
  }

  const geoLabel = 'Geografiskt område'
  const jobLabel = 'Yrkesgrupper'

  return (
    <form className="statistics-search-form" onSubmit={handleSubmit}>
      <div className="statistics-search-form__top-row">
        <div className="statistics-search-form__free-text">
          <div className="statistics-search-form__field-label">
            <label htmlFor="stat-free-text-input">
              Sök på ord i annons och titel
            </label>
            <InfoTooltip label="Information om fritextsökning">
              Sökfältet gör en fritextsökning bland samtliga kategorier i
              annonstexten.
            </InfoTooltip>
          </div>
          <DigiFormInput
            afId="stat-free-text-input"
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

        <TrendsFilter value={trend} onChange={setTrend} />
      </div>

      <div className="statistics-search-form__filters">
        <Dropdown
          isOpen={geoOpen}
          onClose={() => setGeoOpen(false)}
          trigger={
            <div
              className="statistics-search-form__trigger-wrapper"
              onMouseEnter={() => setGeoHover(true)}
              onMouseLeave={() => setGeoHover(false)}
            >
              <DigiButton
                afVariation={ButtonVariation.SECONDARY}
                afSize={ButtonSize.MEDIUM}
                afFullWidth
                onAfOnClick={() => setGeoOpen((open) => !open)}
              >
                <div className="statistics-search-form__filter-trigger">
                  <DigiIconGlobeFilled />
                  <span>{geoLabel}</span>
                  {geoOpen ? <DigiIconChevronUp /> : <DigiIconChevronDown />}
                  {hasGeoSelection && (
                    <span
                      className="statistics-search-form__trigger-dot"
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
            key={geographyFilterKey(geography)}
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

        <div className="statistics-search-form__filter-cell">
          <TimePeriodFilter
            initialPeriod={initial.timePeriod}
            onChange={setTimePeriod}
          />
        </div>

        <Dropdown
          isOpen={jobOpen}
          onClose={() => setJobOpen(false)}
          trigger={
            <div
              className="statistics-search-form__trigger-wrapper"
              onMouseEnter={() => setJobHover(true)}
              onMouseLeave={() => setJobHover(false)}
            >
              <DigiButton
                afVariation={ButtonVariation.SECONDARY}
                afSize={ButtonSize.MEDIUM}
                afFullWidth
                onAfOnClick={() => setJobOpen((open) => !open)}
              >
                <div className="statistics-search-form__filter-trigger">
                  <DigiIconUserAlt />
                  <span>{jobLabel}</span>
                  {jobOpen ? <DigiIconChevronUp /> : <DigiIconChevronDown />}
                  {hasJobSelection && (
                    <span
                      className="statistics-search-form__trigger-dot"
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
            key={jobGroupFilterKey(occupations)}
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

        <div className="statistics-search-form__filter-cell">
          <EmploymentFactsPicker value={employment} onChange={setEmployment} />
        </div>
      </div>

      <div className="statistics-search-form__bottom-row">
        <DrivingLicenseFilter
          value={drivingLicense}
          onChange={setDrivingLicense}
        />
        <CompetencySearch value={skills} onChange={setSkills} />
      </div>

      <div className="statistics-search-form__actions">
        <DigiButton
          afId="statistics-search-button"
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
