import {
  DigiButton,
  DigiFormCheckbox,
  DigiFormInput,
  DigiFormLabel,
  DigiIconChevronRight,
} from '@designsystem-se/af-react'
import { useMemo, useState } from 'react'
import { useGeographyData } from '../../hooks/useGeographyData'
import './GeographyFilter.css'

export default function GeoFilter({ onClose, onApply, initialLan = [], initialKommuner = [] }) {
  const { lanData, loading, error } = useGeographyData()

  const [selectedLan, setSelectedLan] = useState(new Set(initialLan))
  const [selectedKommuner, setSelectedKommuner] = useState(new Set(initialKommuner))
  const [activeLan, setActiveLan] = useState(null)
  const [search, setSearch] = useState('')

  const allLanNames = useMemo(() => Object.keys(lanData).sort(), [lanData])

  const filteredLan = useMemo(
    () =>
      allLanNames.filter((l) => l.toLowerCase().includes(search.toLowerCase())),
    [allLanNames, search],
  )

  const allLanSelected =
    allLanNames.length > 0 && selectedLan.size === allLanNames.length

  const allKommunerSelected =
    activeLan &&
    lanData[activeLan]?.length > 0 &&
    lanData[activeLan].every((k) => selectedKommuner.has(k))

  function toggleAllaLan(checked) {
    if (checked) {
      setSelectedLan(new Set(allLanNames))
    } else {
      setSelectedLan(new Set())
      setActiveLan(null)
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
    lanData[activeLan].forEach((k) => (checked ? next.add(k) : next.delete(k)))
    setSelectedKommuner(next)
  }

  function rensaAllt() {
    setSelectedLan(new Set())
    setSelectedKommuner(new Set())
  }

  function rensaKommuner() {
    if (!activeLan) return
    const kommunerILan = new Set(lanData[activeLan] ?? [])
    setSelectedKommuner(
      (prev) => new Set([...prev].filter((k) => !kommunerILan.has(k))),
    )
  }

  function handleApply() {
    onApply?.({ lan: [...selectedLan], kommuner: [...selectedKommuner] })
  }

  if (loading) {
    return (
      <div className="geo-filter-panel geo-filter-panel--centered">
        <p>Laddar geografi...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="geo-filter-panel geo-filter-panel--centered">
        <p className="geo-filter-error">{error}</p>
        <DigiButton onClick={onClose}>Stäng</DigiButton>
      </div>
    )
  }

  return (
    <div
      className="geo-filter-panel"
      role="dialog"
      aria-label="Välj geografisk filtrering"
    >
      {/* Top-row */}
      <div className="geo-filter-top-row">
        <div className="geo-filter-top-row-left">
          <button
            type="button"
            className="geo-filter-text-button"
            onClick={rensaAllt}
          >
            Rensa allt
          </button>
        </div>
        <div className="geo-filter-top-row-right">
          {activeLan && (
            <button
              type="button"
              className="geo-filter-text-button"
              onClick={rensaKommuner}
            >
              {`Rensa kommuner inom ${activeLan}`}
            </button>
          )}
        </div>
      </div>

      {/* Header-row */}
      <div className="geo-filter-header">
        {/* Left header */}
        <div className="geo-filter-header-left">
          <DigiFormLabel
            afLabel="Sök län eller kommun"
            afFor="geography-filter-search"
          />
          <DigiFormInput
            id="geography-filter-search"
            afLabel="Sök län eller kommun"
            afVariation="medium"
            afType="text"
            afValidation="neutral"
            afValue={search}
            onAfOnInput={(e) => setSearch(e.detail.target.value)}
          />
          <div className="geo-filter-check-row">
            <DigiFormCheckbox
              afLabel="Välj alla län"
              afVariation="primary"
              afChecked={!!allLanSelected}
              afDisabled={allLanNames.length === 0}
              onAfOnChange={(e) => toggleAllaLan(e.detail.target.checked)}
            />
          </div>
        </div>

        {/* Right header */}
        <div className="geo-filter-header-right">
          <div className="geo-filter-check-row">
            <DigiFormCheckbox
              afLabel={
                activeLan
                  ? `Välj alla kommuner inom ${activeLan}`
                  : 'Välj alla kommuner'
              }
              afVariation="primary"
              afChecked={!!allKommunerSelected}
              afDisabled={!activeLan}
              onAfOnChange={(e) => toggleAllaKommuner(e.detail.target.checked)}
            />
          </div>
        </div>
      </div>

      {/* Body-row */}
      <div className="geo-filter-body">
        {/* Left: Läns list */}
        <div className="geo-filter-lan-col">
          <ul className="geo-filter-list" role="listbox" aria-label="Länslista">
            {filteredLan.map((lan) => {
              const hasSelectedKommuner = lanData[lan]?.some((k) =>
                selectedKommuner.has(k),
              )
              const isSelected = selectedLan.has(lan)

              return (
                <li
                  key={lan}
                  className={[
                    'geo-filter-lan-item',
                    isSelected ? 'geo-filter-lan-item--selected' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => {
                    setActiveLan(lan)
                    setSelectedLan(new Set([lan]))
                  }}
                  role="option"
                  aria-selected={activeLan === lan}
                >
                  <span className="geo-filter-lan-label">{lan}</span>
                  <div className="geo-filter-lan-indicator">
                    {hasSelectedKommuner && (
                      <div
                        className={
                          isSelected
                            ? 'geo-filter-lan-indicator--selected-white'
                            : 'geo-filter-lan-indicator--selected'
                        }
                      />
                    )}
                  </div>
                  <DigiIconChevronRight />
                </li>
              )
            })}
          </ul>
        </div>

        {/* Right: Kommun list */}
        <div className="geo-filter-kommun-col">
          {activeLan || allLanSelected ? (
            <ul className="geo-filter-list" aria-label="Kommuner">
              {(allLanSelected
                ? allLanNames.flatMap((l) => lanData[l])
                : lanData[activeLan]
              ).map((k) => (
                <li key={k} className="geo-filter-kommun-item">
                  <DigiFormCheckbox
                    id={`kommun-${k}`}
                    afChecked={selectedKommuner.has(k)}
                    onAfOnChange={(e) =>
                      toggleKommun(k, e.detail.target.checked)
                    }
                  />
                  <label htmlFor={`kommun-${k}`}>{k}</label>
                </li>
              ))}
            </ul>
          ) : (
            <p className="geo-filter-hint">Välj ett län för att se kommuner</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="geo-filter-footer">
        <button
          className="geo-filter-footer-btn geo-filter-footer-btn--secondary"
          onClick={() => onClose?.()}
        >
          Stäng
        </button>
        <button
          className="geo-filter-footer-btn geo-filter-footer-btn--primary"
          onClick={() => {
            handleApply()
            onClose?.()
          }}
        >
          Lägg till och stäng
        </button>
      </div>
    </div>
  )
}
