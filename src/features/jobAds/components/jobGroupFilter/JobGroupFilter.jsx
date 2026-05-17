import {
  DigiButton,
  DigiFormCheckbox,
  DigiFormInput,
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
    setSelectedGroups(new Set())
  }

  function handleApply() {
    onApply?.({ areas: [...selectedAreas], groups: [...selectedGroups] })
  }

  if (loading) {
    return (
      <div className="job-filter-overlay">
        <div className="job-filter-panel job-filter-panel--centered">
          <p>Laddar yrkesdata...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="job-filter-overlay">
        <div className="job-filter-panel job-filter-panel--centered">
          <p className="job-filter-error">{error}</p>
          <DigiButton onClick={onClose}>Stäng</DigiButton>
        </div>
      </div>
    )
  }

  return (
    <div
      className="job-filter-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose?.()
      }}
    >
      <div
        className="job-filter-panel"
        role="dialog"
        aria-label="Välj yrkesfiltrering"
      >
        {/* Body */}
        <div className="job-filter-body">
          {/* Vänster: Yrkesområdeslista */}
          <div className="job-filter-area-col">
            <div className="job-filter-area-col-header">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignSelf: 'stretch',
                }}
              >
                <DigiButton
                  afSize="small"
                  afVariation="function"
                  afFullWidth={false}
                  onClick={rensaAllt}
                >
                  Rensa
                </DigiButton>
              </div>
              <DigiFormInput
                afLabel="Sök yrkesområde eller yrkesgrupp"
                placeholder="Sök..."
                afVariation="medium"
                afType="text"
                afValidation="neutral"
                afValue={search}
                onAfOnInput={(e) => setSearch(e.detail.target.value)}
              />
            </div>

            <div className="job-filter-check-row">
              <div className="job-filter-check-row-inner">
                <DigiFormCheckbox
                  afLabel="Välj alla yrkesområden"
                  afVariation="primary"
                  afChecked={!!allAreasSelected}
                  afDisabled={allAreaNames.length === 0}
                  onAfOnChange={(e) => toggleAllaAreas(e.detail.target.checked)}
                />
              </div>
            </div>

            <ul
              className="job-filter-list"
              role="listbox"
              aria-label="Yrkesområdeslista"
            >
              {filteredAreas.map((area) => (
                <li
                  key={area}
                  className="job-filter-area-item"
                  onClick={() => setActiveArea(area)}
                  role="option"
                  aria-selected={activeArea === area}
                >
                  <span className="job-filter-area-label">{area}</span>
                  <div className="job-filter-area-indicator">
                    {jobData[area]?.some((g) => selectedGroups.has(g)) && (
                      <div className="job-filter-area-indicator--selected" />
                    )}
                  </div>
                  <DigiIconChevronRight />
                </li>
              ))}
            </ul>
          </div>

          {/* Höger: Yrkesgruppslista */}
          <div className="job-filter-group-col">
            <div className="job-filter-area-col-header">
              <div className="job-filter-rensa-groups-row">
                <DigiButton
                  afSize="small"
                  afVariation="function"
                  afFullWidth={false}
                  onClick={rensaYrkesgrupper}
                >
                  Rensa
                </DigiButton>
                <DigiButton
                  afVariation="function"
                  afSize="small"
                  onClick={() => {
                    handleApply()
                    onClose()
                  }}
                >
                  Stäng
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      marginLeft: '12px',
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M20.4972 1.5L22.5 3.50281L14.0024 12L22.5 20.4972L20.4972 22.5L12 14.0024L3.50281 22.5L1.5 20.4972L9.99713 12L1.5 3.50281L3.50281 1.5L12 9.99713L20.4972 1.5Z"
                        fill="#1616B2"
                      />
                    </svg>
                  </span>
                </DigiButton>
              </div>
              <div className="job-filter-check-row">
                <div className="job-filter-check-group-row-inner">
                  <DigiFormCheckbox
                    afLabel="Välj alla yrkesgrupper"
                    afVariation="primary"
                    afChecked={!!allGroupsSelected}
                    afDisabled={!activeArea}
                    onAfOnChange={(e) =>
                      toggleAllaGroups(e.detail.target.checked)
                    }
                  />
                </div>
              </div>
            </div>

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
              <p className="job-filter-hint">
                Välj ett yrkesområde för att se yrkesgrupper
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
