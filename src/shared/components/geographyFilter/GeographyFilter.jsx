import { useState, useMemo } from 'react'
import {
  DigiFormCheckbox,
  DigiFormLabel,
  DigiFormInput,
  DigiButton,
  DigiIconChevronRight
} from '@designsystem-se/af-react'
import { useGeographyData } from '../../hooks/useGeographyData'
import './GeographyFilter.css'

export default function GeoFilter({ onClose, onApply }) {
  const { lanData, loading, error } = useGeographyData()

  const [selectedLan, setSelectedLan] = useState(new Set())
  const [selectedKommuner, setSelectedKommuner] = useState(new Set())
  const [activeLan, setActiveLan] = useState(null)
  const [search, setSearch] = useState('')

  const allLanNames = useMemo(
    () => Object.keys(lanData).sort(),
    [lanData]
  )

  const filteredLan = useMemo(
    () => allLanNames.filter(l => l.toLowerCase().includes(search.toLowerCase())),
    [allLanNames, search]
  )

  const allLanSelected = allLanNames.length > 0 && selectedLan.size === allLanNames.length
  const allKommunerSelected =
    activeLan &&
    lanData[activeLan]?.length > 0 &&
    lanData[activeLan].every(k => selectedKommuner.has(k))

  function toggleAllaLan(checked) {
    if (checked) {
      setSelectedLan(new Set(allLanNames));
    } else {
      setSelectedLan(new Set());
      setActiveLan(null);
    }
  }

  function toggleKommun(k, checked) {
    const next = new Set(selectedKommuner)
    checked ? next.add(k) : next.delete(k)
    setSelectedKommuner(next)
  }

  function toggleAllaKommuner(checked) {
    if (!activeLan) return
    const next = new Set(selectedKommuner)
    lanData[activeLan].forEach(k => (checked ? next.add(k) : next.delete(k)))
    setSelectedKommuner(next)
  }

  function rensaAllt() {
    setSelectedLan(new Set())
    setSelectedKommuner(new Set())
  }

  function rensaKommuner() {
    setSelectedKommuner(new Set());
  }

  function handleApply() {
    onApply?.({ lan: [...selectedLan], kommuner: [...selectedKommuner] })
  }

  if (loading) {
    return (
      <div className="geo-filter-overlay">
        <div className="geo-filter-panel geo-filter-panel--centered">
          <p>Laddar geografi...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="geo-filter-overlay">
        <div className="geo-filter-panel geo-filter-panel--centered">
          <p className="geo-filter-error">{error}</p>
          <DigiButton onClick={onClose}>Stäng</DigiButton>
        </div>
      </div>
    )
  }

  return (
    <div className="geo-filter-overlay">
      <div className="geo-filter-panel" role="dialog" aria-label="Välj geografisk filtrering">

        {/* Body */}
        <div className="geo-filter-body">

          {/* Vänster: Länslista */}
          <div className="geo-filter-lan-col">
            <div className="geo-filter-lan-col-header">
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignSelf: 'stretch' }}>
                <DigiButton
                  afSize="small"
                  afVariation="function"
                  afFullWidth={false}
                  onClick={rensaAllt}
                >
                  Rensa allt
                </DigiButton>
              </div>
              <DigiFormInput
                afLabel="Sök län eller kommun"
                placeholder="Sök..."
                afVariation="medium"
                afType="text"
                afValidation="neutral"
                afValue={search}
                onAfOnInput={e => setSearch(e.detail.target.value)}
              />
            </div>

            <div className="geo-filter-check-row">
              <div className="geo-filter-check-row-inner">
                <DigiFormCheckbox
                  afLabel="Välj alla Län"
                  afVariation="primary"
                  afChecked={!!allLanSelected}
                  afDisabled={!activeLan}
                  onAfOnChange={e => toggleAllaLan(e.detail.target.checked)}
                />
              </div>
            </div>

            <ul className="geo-filter-list" role="listbox" aria-label="Länslista">
              {filteredLan.map(lan => (
                <li
                  key={lan}
                  className="geo-filter-lan-item"
                  onClick={() => setActiveLan(lan)}
                  role="option"
                  aria-selected={activeLan === lan}
                >
                  <span className="geo-filter-lan-label">{lan}</span>
                  <div className="geo-filter-lan-indicator">
                    {lanData[lan]?.some(k => selectedKommuner.has(k)) && (
                      <div className="geo-filter-lan-indicator--selected" />
                    )}
                  </div>
                  <DigiIconChevronRight />
                </li>
              ))}
            </ul>
          </div>

          {/* Höger: Kommunlista */}
          <div className="geo-filter-kommun-col">
            <div className="geo-filter-lan-col-header">
              <div className="geo-filter-rensa-kommuner-row">
                <DigiButton
                  afSize="small"
                  afVariation="function"
                  afFullWidth={false}
                  onClick={rensaKommuner}
                >
                  Rensa alla kommuner
                </DigiButton>
                <DigiButton
                  afVariation="function"
                  afSize="small"
                  onClick={() => {
                    handleApply();
                    onClose();
                  }}
                >
                  Stäng
                  <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '12px' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M20.4972 1.5L22.5 3.50281L14.0024 12L22.5 20.4972L20.4972 22.5L12 14.0024L3.50281 22.5L1.5 20.4972L9.99713 12L1.5 3.50281L3.50281 1.5L12 9.99713L20.4972 1.5Z" fill="#1616B2"/>
                    </svg>
                  </span>
                </DigiButton>
              </div>
              <div className="geo-filter-check-row">
                <div className="geo-filter-check-kommun-row-inner">
                  <DigiFormCheckbox
                    afLabel="Välj alla Kommuner"
                    afVariation="primary"
                    afChecked={!!allKommunerSelected}
                    afDisabled={!activeLan}
                    onAfOnChange={e => toggleAllaKommuner(e.detail.target.checked)}
                  />
                </div>
              </div>
            </div>

            {activeLan || allLanSelected ? (
              <ul className="geo-filter-list" aria-label="Kommuner">
                {(allLanSelected
                  ? allLanNames.flatMap(l => lanData[l])
                  : lanData[activeLan]
                ).map(k => (
                  <li key={k} className="geo-filter-kommun-item">
                    <DigiFormCheckbox
                      id={`kommun-${k}`}
                      afChecked={selectedKommuner.has(k)}
                      onAfOnChange={e => toggleKommun(k, e.detail.target.checked)}
                    />
                    <DigiFormLabel afLabel={k} afFor={`kommun-${k}`} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="geo-filter-hint"> </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
