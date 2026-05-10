import { useState } from 'react'
import './StatisticsSearchForm.css'
import { DigiFormInputSearch, DigiButton } from '@designsystem-se/af-react'
import { FormInputSearchVariation, ButtonVariation, ButtonType } from '@designsystem-se/af'

const YEARS = ['2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025']

const LAN = [
  'Stockholms län','Uppsala län','Södermanlands län','Östergötlands län',
  'Jönköpings län','Kronobergs län','Kalmar län','Gotlands län','Blekinge län',
  'Skåne län','Hallands län','Västra Götalands län','Värmlands län','Örebro län',
  'Västmanlands län','Dalarnas län','Gävleborgs län','Västernorrlands län',
  'Jämtlands län','Västerbottens län','Norrbottens län',
]

function StatisticsSearchForm({ onSearch, onReset }) {
  const [kompetens, setKompetens] = useState('')
  const [selectedLan, setSelectedLan] = useState([])
  const [selectedAr, setSelectedAr] = useState([])
  const [openFilter, setOpenFilter] = useState(null)

  const toggleOption = (setter, current, value) => {
    setter(current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    )
  }

  const toggleFilter = (name) => setOpenFilter(prev => prev === name ? null : name)

  const handleSubmit = (e) => {
    e.preventDefault()
    const params = { kompetens, lan: selectedLan, ar: selectedAr }
    console.log('[StatisticsSearchForm] Söker med params:', params)
    onSearch?.(params)
  }

  const handleReset = () => {
    setKompetens('')
    setSelectedLan([])
    setSelectedAr([])
    setOpenFilter(null)
    onReset?.()
  }

  return (
    <form className="statistics-search-form" onSubmit={handleSubmit}>
      <div className="statistics-search-form__filters">

        <DigiFormInputSearch
          afLabel="Sök på kompetenser"
          afVariation={FormInputSearchVariation.LARGE}
          afValue={kompetens}
          afHideButton={true}
          onAfOnInput={(e) => { const val = e.detail?.target?.value ?? ''; console.log('[StatisticsSearchForm] onAfOnInput val:', val); setKompetens(val) }}
          onAfOnSubmitSearch={(e) => setKompetens(e.detail)}
        />

        {/* Geografiskt område */}
        <div className="statistics-search-form__filter-wrapper">
          <DigiButton
            afVariation={ButtonVariation.SECONDARY}
            afType={ButtonType.BUTTON}
            onAfOnClick={() => toggleFilter('lan')}
          >
            {selectedLan.length > 0 ? `Geografiskt område (${selectedLan.length})` : 'Geografiskt område'}
          </DigiButton>
          {openFilter === 'lan' && (
            <ul className="statistics-search-form__filter-dropdown">
              {LAN.map(l => (
                <li key={l}>
                  <label className="statistics-search-form__filter-option">
                    <input
                      type="checkbox"
                      checked={selectedLan.includes(l)}
                      onChange={() => toggleOption(setSelectedLan, selectedLan, l)}
                    />
                    {l}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Tidsperiod */}
        <div className="statistics-search-form__filter-wrapper">
          <DigiButton
            afVariation={ButtonVariation.SECONDARY}
            afType={ButtonType.BUTTON}
            onAfOnClick={() => toggleFilter('ar')}
          >
            {selectedAr.length > 0 ? `Tidsperiod (${selectedAr.length})` : 'Tidsperiod'}
          </DigiButton>
          {openFilter === 'ar' && (
            <ul className="statistics-search-form__filter-dropdown statistics-search-form__filter-dropdown--years">
              {YEARS.map(y => (
                <li key={y}>
                  <label className="statistics-search-form__filter-option">
                    <input
                      type="checkbox"
                      checked={selectedAr.includes(y)}
                      onChange={() => toggleOption(setSelectedAr, selectedAr, y)}
                    />
                    {y}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Yrkesgrupper — ej implementerat */}
        <div className="statistics-search-form__filter-wrapper">
          <DigiButton afVariation={ButtonVariation.SECONDARY} afType={ButtonType.BUTTON}>
            Yrkesgrupper
          </DigiButton>
        </div>

        {/* Fakta anställning — ej implementerat */}
        <div className="statistics-search-form__filter-wrapper">
          <DigiButton afVariation={ButtonVariation.SECONDARY} afType={ButtonType.BUTTON}>
            Fakta anställning
          </DigiButton>
        </div>

      </div>

      <div className="statistics-search-form__actions">
        <DigiButton
          afVariation={ButtonVariation.SECONDARY}
          afType={ButtonType.BUTTON}
          onAfOnClick={handleReset}
        >
          Rensa
        </DigiButton>
        <DigiButton
          afVariation={ButtonVariation.PRIMARY}
          afType={ButtonType.SUBMIT}
        >
          Sök
        </DigiButton>
      </div>
    </form>
  )
}

export default StatisticsSearchForm
