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

export default function JobGroupFilter({
  onClose,
  onApply,
  initialAreas = [],
  initialGroups = [],
}) {
  const { jobData, loading, error } = useJobData()

  const [selectedAreas, setSelectedAreas] = useState(new Set(initialAreas))
  const [selectedGroups, setSelectedGroups] = useState(new Set(initialGroups))
  const [activeArea, setActiveArea] = useState(null)
  const [search, setSearch] = useState('')

  const allAreaNames = useMemo(() => Object.keys(jobData).sort(), [jobData])

  const filteredAreas = useMemo(() => {
    if (!search) return allAreaNames
    const q = search.toLowerCase()
    return allAreaNames.filter(
      (a) =>
        a.toLowerCase().includes(q) ||
        jobData[a]?.groups.some((g) => g.label.toLowerCase().includes(q)),
    )
  }, [allAreaNames, search, jobData])

  const displayArea = useMemo(() => {
    if (activeArea) return activeArea
    if (!search) return null
    const q = search.toLowerCase()
    const areasViaGroup = allAreaNames.filter(
      (a) =>
        !a.toLowerCase().includes(q) &&
        jobData[a]?.groups.some((g) => g.label.toLowerCase().includes(q)),
    )
    if (areasViaGroup.length === 1) return areasViaGroup[0]
    return null
  }, [activeArea, search, allAreaNames, jobData])

  const filteredGroups = useMemo(() => {
    if (!displayArea) return []
    const groups = jobData[displayArea]?.groups ?? []
    if (!search) return groups
    const q = search.toLowerCase()
    if (displayArea.toLowerCase().includes(q)) return groups
    return groups.filter((g) => g.label.toLowerCase().includes(q))
  }, [displayArea, jobData, search])

  const allAreasSelected =
    allAreaNames.length > 0 && selectedAreas.size === allAreaNames.length

  const groupTargetAreas = useMemo(() => {
    if (activeArea) return [activeArea]
    if (allAreasSelected) return allAreaNames
    return [...selectedAreas]
  }, [activeArea, allAreasSelected, allAreaNames, selectedAreas])

  const allGroupsSelected =
    groupTargetAreas.length > 0 &&
    groupTargetAreas.every(
      (area) =>
        (jobData[area]?.groups.length ?? 0) > 0 &&
        jobData[area].groups.every((g) => selectedGroups.has(g.id)),
    )

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
    checked ? next.add(g.id) : next.delete(g.id)
    setSelectedGroups(next)
  }

  function toggleAllaGroups(checked) {
    if (groupTargetAreas.length === 0) return
    const next = new Set(selectedGroups)
    for (const area of groupTargetAreas) {
      for (const g of jobData[area]?.groups ?? []) {
        if (checked) next.add(g.id)
        else next.delete(g.id)
      }
    }
    setSelectedGroups(next)
  }

  function rensaAllt() {
    setSelectedAreas(new Set())
    setSelectedGroups(new Set())
  }

  function rensaYrkesgrupper() {
    if (!activeArea) return
    const groupsInArea = new Set(jobData[activeArea].groups.map((g) => g.id))
    setSelectedGroups(
      (prev) => new Set([...prev].filter((id) => !groupsInArea.has(id))),
    )
  }

  function handleApply() {
    const groupIds = [...selectedGroups]

    const grouped = {}
    for (const area of allAreaNames) {
      const groups =
        jobData[area]?.groups.filter((g) => selectedGroups.has(g.id)) ?? []
      if (groups.length > 0) grouped[area] = groups.map((g) => g.label)
    }

    onApply?.({ areas: [], groups: groupIds, grouped })
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
          {(activeArea || allAreasSelected) && (
            <button
              type="button"
              className="job-filter-text-button"
              onClick={
                allAreasSelected
                  ? () => setSelectedGroups(new Set())
                  : rensaYrkesgrupper
              }
            >
              {allAreasSelected
                ? 'Rensa alla yrkesgrupper'
                : `Rensa yrkesgrupper inom ${activeArea}`}
            </button>
          )}
        </div>
      </div>

      {/* Header */}
      <div className="job-filter-header">
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
              afDisabled={groupTargetAreas.length === 0}
              onAfOnChange={(e) => toggleAllaGroups(e.detail.target.checked)}
            />
          </div>
        </div>
      </div>

      {/* Body-row */}
      <div className="job-filter-body">
        <div className="job-filter-area-col">
          <ul
            className="job-filter-list"
            role="listbox"
            aria-label="Yrkesområdeslista"
          >
            {filteredAreas.map((area) => {
              const hasSelectedGroups = jobData[area]?.groups.some((g) =>
                selectedGroups.has(g.id),
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

        <div className="job-filter-group-col">
          {displayArea || allAreasSelected ? (
            <ul className="job-filter-list" aria-label="Yrkesgrupper">
              {(allAreasSelected
                ? allAreaNames.flatMap((a) => {
                    const groups = jobData[a]?.groups ?? []
                    if (!search) return groups
                    const q = search.toLowerCase()
                    if (a.toLowerCase().includes(q)) return groups
                    return groups.filter((g) =>
                      g.label.toLowerCase().includes(q),
                    )
                  })
                : filteredGroups
              ).map((g) => (
                <li key={g.id} className="job-filter-group-item">
                  <DigiFormCheckbox
                    id={`group-${g.id}`}
                    afChecked={selectedGroups.has(g.id)}
                    onAfOnChange={(e) =>
                      toggleGroup(g, e.detail.target.checked)
                    }
                  />
                  <label htmlFor={`group-${g.id}`}>{g.label}</label>
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
