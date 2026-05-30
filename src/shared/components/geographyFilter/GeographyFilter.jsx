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

export default function GeoFilter({
  onClose,
  onApply,
  initialLan = [],
  initialKommuner = [],
}) {
  const { lanData, loading, error } = useGeographyData()

  const [selectedLan, setSelectedLan] = useState(new Set(initialLan))
  const [selectedKommuner, setSelectedKommuner] = useState(
    new Set(initialKommuner),
  )
  const [activeLan, setActiveLan] = useState(null)
  const [search, setSearch] = useState('')

  const allLanNames = useMemo(() => Object.keys(lanData).sort(), [lanData])

  const filteredLan = useMemo(() => {
    if (!search) return allLanNames
    const q = search.toLowerCase()
    return allLanNames.filter(
      (l) =>
        l.toLowerCase().includes(q) ||
        lanData[l]?.kommuner.some((k) => k.label.toLowerCase().includes(q)),
    )
  }, [allLanNames, search, lanData])

  const displayLan = useMemo(() => {
    if (activeLan) return activeLan
    if (!search) return null
    const q = search.toLowerCase()

    const lanViaKommun = allLanNames.filter(
      (l) =>
        !l.toLowerCase().includes(q) &&
        lanData[l]?.kommuner.some((k) => k.label.toLowerCase().includes(q)),
    )
    if (lanViaKommun.length === 1) return lanViaKommun[0]
    return null
  }, [activeLan, search, allLanNames, lanData])

  const filteredKommuner = useMemo(() => {
    if (!displayLan) return []
    const kommuner = lanData[displayLan]?.kommuner ?? []
    if (!search) return kommuner
    const q = search.toLowerCase()
    if (displayLan.toLowerCase().includes(q)) return kommuner
    return kommuner.filter((k) => k.label.toLowerCase().includes(q))
  }, [displayLan, lanData, search])

  const allLanSelected =
    allLanNames.length > 0 && selectedLan.size === allLanNames.length

  const kommunTargetLan = useMemo(() => {
    if (activeLan) return [activeLan]
    if (allLanSelected) return allLanNames
    return [...selectedLan]
  }, [activeLan, allLanSelected, allLanNames, selectedLan])

  const allKommunerSelected =
    kommunTargetLan.length > 0 &&
    kommunTargetLan.every(
      (lan) =>
        (lanData[lan]?.kommuner.length ?? 0) > 0 &&
        lanData[lan].kommuner.every((k) => selectedKommuner.has(k.id)),
    )

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
    checked ? next.add(k.id) : next.delete(k.id)
    setSelectedKommuner(next)
  }

  function toggleAllaKommuner(checked) {
    if (kommunTargetLan.length === 0) return
    const next = new Set(selectedKommuner)
    for (const lan of kommunTargetLan) {
      for (const k of lanData[lan]?.kommuner ?? []) {
        if (checked) next.add(k.id)
        else next.delete(k.id)
      }
    }
    setSelectedKommuner(next)
  }

  function rensaAllt() {
    setSelectedLan(new Set())
    setSelectedKommuner(new Set())
  }

  function rensaKommuner() {
    if (!activeLan) return
    const kommunerILan = new Set(lanData[activeLan].kommuner.map((k) => k.id))
    setSelectedKommuner(
      (prev) => new Set([...prev].filter((id) => !kommunerILan.has(id))),
    )
  }

  function handleApply() {
    const kommunIds = new Set(selectedKommuner)

    // A län marked without any individual kommun checked means "the whole län".
    // Expand it to all its kommuner so the search is actually scoped — an empty
    // municipality filter would otherwise return the entire corpus. Skip this
    // when every län is selected, since "no filter" already means "everywhere".
    if (!allLanSelected) {
      for (const lan of selectedLan) {
        const kommuner = lanData[lan]?.kommuner ?? []
        const hasCheckedKommun = kommuner.some((k) =>
          selectedKommuner.has(k.id),
        )
        if (!hasCheckedKommun) {
          for (const k of kommuner) kommunIds.add(k.id)
        }
      }
    }

    const grouped = {}
    for (const lan of allLanNames) {
      const kommuner =
        lanData[lan]?.kommuner.filter((k) => kommunIds.has(k.id)) ?? []
      if (kommuner.length > 0) grouped[lan] = kommuner.map((k) => k.label)
    }

    onApply?.({ lan: [], kommuner: [...kommunIds], grouped })
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
          {(activeLan || allLanSelected) && (
            <button
              type="button"
              className="geo-filter-text-button"
              onClick={
                allLanSelected
                  ? () => setSelectedKommuner(new Set())
                  : rensaKommuner
              }
            >
              {allLanSelected
                ? 'Rensa alla kommuner'
                : `Rensa kommuner inom ${activeLan}`}
            </button>
          )}
        </div>
      </div>

      {/* Header-row */}
      <div className="geo-filter-header">
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
              afDisabled={kommunTargetLan.length === 0}
              onAfOnChange={(e) => toggleAllaKommuner(e.detail.target.checked)}
            />
          </div>
        </div>
      </div>

      {/* Body-row */}
      <div className="geo-filter-body">
        <div className="geo-filter-lan-col">
          <ul className="geo-filter-list" role="listbox" aria-label="Länslista">
            {filteredLan.map((lan) => {
              const hasSelectedKommuner = lanData[lan]?.kommuner.some((k) =>
                selectedKommuner.has(k.id),
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

        <div className="geo-filter-kommun-col">
          {displayLan || allLanSelected ? (
            <ul className="geo-filter-list" aria-label="Kommuner">
              {(allLanSelected
                ? allLanNames.flatMap((l) => {
                    const kommuner = lanData[l]?.kommuner ?? []
                    if (!search) return kommuner
                    const q = search.toLowerCase()
                    if (l.toLowerCase().includes(q)) return kommuner
                    return kommuner.filter((k) =>
                      k.label.toLowerCase().includes(q),
                    )
                  })
                : filteredKommuner
              ).map((k) => (
                <li key={k.id} className="geo-filter-kommun-item">
                  <DigiFormCheckbox
                    id={`kommun-${k.id}`}
                    afChecked={selectedKommuner.has(k.id)}
                    onAfOnChange={(e) =>
                      toggleKommun(k, e.detail.target.checked)
                    }
                  />
                  <label htmlFor={`kommun-${k.id}`}>{k.label}</label>
                </li>
              ))}
            </ul>
          ) : (
            <p className="geo-filter-hint"></p>
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
