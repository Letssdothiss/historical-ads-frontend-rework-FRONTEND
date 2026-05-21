import {
  DigiButton,
  DigiFormCheckbox,
  DigiFormInput,
  DigiFormLabel,
  DigiIconChevronRight,
} from '@designsystem-se/af-react'
import { useMemo, useState } from 'react'
import { useJobData } from '../../hooks/useJobData'
import './JobGroupFilter.css'

export default function JobGroupFilter({ onClose, onApply }) {
  const { jobData, loading, error } = useJobData()

  const [selectedAreas, setSelectedAreas] = useState(new Set())
  const [selectedGroups, setSelectedGroups] = useState(new Set())
  const [activeArea, setActiveArea] = useState(null)
  const [search, setSearch] = useState('')

  const allAreaNames = useMemo(() => Object.keys(jobData).sort(), [jobData])

  const filteredAreas = useMemo(
    () =>
      allAreaNames.filter((a) =>
        a.toLowerCase().includes(search.toLowerCase()),
      ),
    [allAreaNames, search],
  )

  const allAreasSelected =
    allAreaNames.length > 0 && selectedAreas.size === allAreaNames.length

  const allGroupsSelected =
    activeArea &&
    jobData[activeArea]?.length > 0 &&
    jobData[activeArea].every((g) => selectedGroups.has(g))

  function toggleAllaAreas(checked) {
    if (checked) {
      setSelectedAreas(new Set(allAreaNames))
    } else {
      setSelectedAreas(new Set())
      setActiveArea(null)
    }
  }

  function toggleGroup(g, checked) {
    const next = new Set(selectedGroups)
    checked ? next.add(g) : next.delete(g)
    setSelectedGroups(next)
  }

  function toggleAllaGroups(checked) {
    if (!activeArea) return
    const next = new Set(selectedGroups)
    jobData[activeArea].forEach((g) => (checked ? next.add(g) : next.delete(g)))
    setSelectedGroups(next)
  }

  function rensaAllt() {
    setSelectedAreas(new Set())
    setSelectedGroups(new Set())
  }

  function rensaYrkesgrupper() {
    if (!activeArea) return
    const groupsInArea = new Set(jobData[activeArea] ?? [])
    setSelectedGroups(
      (prev) => new Set([...prev].filter((g) => !groupsInArea.has(g))),
    )
  }

  function handleApply() {
    onApply?.({ areas: [...selectedAreas], groups: [...selectedGroups] })
  }

  if (loading) {
    return (
      <div className="job-filter-panel job-filter-panel--centered">
        <p>Laddar yrkesdata...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="job-filter-panel job-filter-panel--centered">
        <p className="job-filter-error">{error}</p>
        <DigiButton onClick={onClose}>Stäng</DigiButton>
      </div>
    )
  }

  return (
    <div
      className="job-filter-panel"
      role="dialog"
      aria-label="Välj yrkesfiltrering"
    >
      {/* Top-row */}
      <div className="job-filter-top-row">
        <div className="job-filter-top-row-left">
          <button
            type="button"
            className="job-filter-text-button"
            onClick={rensaAllt}
          >
            Rensa allt
          </button>
        </div>
        <div className="job-filter-top-row-right">
          {activeArea && (
            <button
              type="button"
              className="job-filter-text-button"
              onClick={rensaYrkesgrupper}
            >
              {`Rensa yrkesgrupper inom ${activeArea}`}
            </button>
          )}
        </div>
      </div>

      {/* Header */}
      <div className="job-filter-header">
        {/* Left header */}
        <div className="job-filter-header-left">
          <DigiFormLabel
            afLabel="Sök yrkesområde eller yrkesgrupp"
            afFor="job-filter-search"
          />
          <DigiFormInput
            id="job-filter-search"
            afLabel="Sök yrkesområde eller yrkesgrupp"
            afVariation="medium"
            afType="text"
            afValidation="neutral"
            afValue={search}
            onAfOnInput={(e) => setSearch(e.detail.target.value)}
          />
          <div className="job-filter-check-row">
            <DigiFormCheckbox
              afLabel="Välj alla yrkesområden"
              afVariation="primary"
              afChecked={!!allAreasSelected}
              afDisabled={allAreaNames.length === 0}
              onAfOnChange={(e) => toggleAllaAreas(e.detail.target.checked)}
            />
          </div>
        </div>

        {/* Right header */}
        <div className="job-filter-header-right">
          <div className="job-filter-check-row">
            <DigiFormCheckbox
              afLabel={
                activeArea
                  ? `Välj alla yrkesgrupper inom ${activeArea}`
                  : 'Välj alla yrkesgrupper'
              }
              afVariation="primary"
              afChecked={!!allGroupsSelected}
              afDisabled={!activeArea}
              onAfOnChange={(e) => toggleAllaGroups(e.detail.target.checked)}
            />
          </div>
        </div>
      </div>

      {/* Body-row */}
      <div className="job-filter-body">
        {/* Left: Yrkesområdes list */}
        <div className="job-filter-area-col">
          <ul
            className="job-filter-list"
            role="listbox"
            aria-label="Yrkesområdeslista"
          >
            {filteredAreas.map((area) => {
              const hasSelectedGroups = jobData[area]?.some((g) =>
                selectedGroups.has(g),
              )
              const isSelected = selectedAreas.has(area)
              const isActive = activeArea === area

              return (
                <li
                  key={area}
                  className={[
                    'job-filter-area-item',
                    isSelected || isActive
                      ? 'job-filter-area-item--selected'
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => {
                    setActiveArea(area)
                    setSelectedAreas(new Set([area]))
                  }}
                  role="option"
                  aria-selected={activeArea === area}
                >
                  <span className="job-filter-area-label">{area}</span>
                  <div className="job-filter-area-indicator">
                    {hasSelectedGroups && (
                      <div
                        className={
                          isSelected
                            ? 'job-filter-area-indicator--selected-white'
                            : 'job-filter-area-indicator--selected'
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

        {/* Right: Yrkesgrupps list */}
        <div className="job-filter-group-col">
          {activeArea || allAreasSelected ? (
            <ul className="job-filter-list" aria-label="Yrkesgrupper">
              {(allAreasSelected
                ? allAreaNames.flatMap((a) => jobData[a])
                : jobData[activeArea]
              ).map((g) => (
                <li key={g} className="job-filter-group-item">
                  <DigiFormCheckbox
                    id={`group-${g}`}
                    afChecked={selectedGroups.has(g)}
                    onAfOnChange={(e) =>
                      toggleGroup(g, e.detail.target.checked)
                    }
                  />
                  <label htmlFor={`group-${g}`}>{g}</label>
                </li>
              ))}
            </ul>
          ) : (
            <p className="job-filter-hint"></p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="job-filter-footer">
        <button
          className="job-filter-footer-btn job-filter-footer-btn--secondary"
          onClick={() => onClose?.()}
        >
          Stäng
        </button>
        <button
          className="job-filter-footer-btn job-filter-footer-btn--primary"
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
