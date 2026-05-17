import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  DigiButton,
  DigiFormInput,
  DigiIconGlobe,
  DigiIconUserAlt,
  DigiIconChevronDown,
} from '@designsystem-se/af-react'
import {
  ButtonSize,
  ButtonVariation,
  ButtonType,
  FormInputVariation,
  FormInputType,
  FormInputValidation,
} from '@designsystem-se/af'
import GeographyFilter from '../../../../shared/components/geographyFilter/GeographyFilter'
import JobGroupFilter from '../../../jobAds/components/jobGroupFilter/JobGroupFilter'
import TimePeriodFilter from '../../../../shared/components/timePeriodFilter/TimePeriodFilter'
import CompetencySearch from '../../../../shared/components/competencySearch/CompetencySearch'
import EmploymentFactsPicker from '../../../../shared/components/employmentFactsPicker/EmploymentFactsPicker'
import TrendsFilter from '../trendsFilter/TrendsFilter'
import DrivingLicenseFilter from '../DrivingLicenseFilter/DrivingLicenseFilter'
import FilterIndicator from '../../../../shared/components/filterIndicator/FilterIndicator'
import InfoTooltip from '../../../../shared/components/infoTooltip/InfoTooltip'
import './StatisticsSearchForm.css'

export default function StatisticsSearchForm() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [trend, setTrend] = useState('')
  const [drivingLicense, setDrivingLicense] = useState('')
  const [geoOpen, setGeoOpen] = useState(false)
  const [jobOpen, setJobOpen] = useState(false)
  const [geography, setGeography] = useState({ lan: [], kommuner: [] })
  const [occupations, setOccupations] = useState({ areas: [], groups: [] })
  const [timePeriod, setTimePeriod] = useState({ years: [], months: [] })
  const [employment, setEmployment] = useState({
    type: [],
    duration: [],
    scope: [],
  })
  const [skills, setSkills] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    if (trend) params.set('trend', trend)
    if (drivingLicense) params.set('korkort', drivingLicense)
    geography.lan.forEach((l) => params.append('lan', l))
    geography.kommuner.forEach((k) => params.append('kommun', k))
    occupations.areas.forEach((a) => params.append('yrkesomrade', a))
    occupations.groups.forEach((g) => params.append('yrkesgrupp', g))
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
        <div className="statistics-search-form__filter-cell">
          <DigiButton
            afVariation={ButtonVariation.SECONDARY}
            afSize={ButtonSize.MEDIUM}
            afFullWidth
            onAfOnClick={() => setGeoOpen(true)}
          >
            <div className="statistics-search-form__filter-trigger">
              <DigiIconGlobe />
              <span>{geoLabel}</span>
              <DigiIconChevronDown />
            </div>
          </DigiButton>
          <FilterIndicator
            heading="Valt område"
            groups={[
              { label: 'Län', items: geography.lan },
              { label: 'Kommuner', items: geography.kommuner },
            ]}
          />
        </div>

        <div className="statistics-search-form__filter-cell">
          <TimePeriodFilter onChange={setTimePeriod} />
          <FilterIndicator
            heading="Vald tidsperiod"
            groups={[
              { label: 'Årtal', items: timePeriod.years },
              { label: 'Månader', items: timePeriod.months },
            ]}
          />
        </div>

        <div className="statistics-search-form__filter-cell">
          <DigiButton
            afVariation={ButtonVariation.SECONDARY}
            afSize={ButtonSize.MEDIUM}
            afFullWidth
            onAfOnClick={() => setJobOpen(true)}
          >
            <div className="statistics-search-form__filter-trigger">
              <DigiIconUserAlt />
              <span>{jobLabel}</span>
              <DigiIconChevronDown />
            </div>
          </DigiButton>
          <FilterIndicator
            heading="Valda yrken"
            groups={[
              { label: 'Yrkesområden', items: occupations.areas },
              { label: 'Yrkesgrupper', items: occupations.groups },
            ]}
          />
        </div>

        <div className="statistics-search-form__filter-cell">
          <EmploymentFactsPicker
            value={employment}
            onChange={setEmployment}
          />
        </div>
      </div>

      <div className="statistics-search-form__bottom-row">
        <DrivingLicenseFilter onChange={setDrivingLicense} />
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

      {geoOpen && (
        <GeographyFilter
          onClose={() => setGeoOpen(false)}
          onApply={({ lan, kommuner }) =>
            setGeography({ lan: lan ?? [], kommuner: kommuner ?? [] })
          }
        />
      )}
      {jobOpen && (
        <JobGroupFilter
          onClose={() => setJobOpen(false)}
          onApply={({ areas, groups }) =>
            setOccupations({ areas: areas ?? [], groups: groups ?? [] })
          }
        />
      )}
    </form>
  )
}
