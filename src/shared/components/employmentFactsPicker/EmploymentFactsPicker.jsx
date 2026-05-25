import { ButtonSize, ButtonVariation } from '@designsystem-se/af'
import {
  DigiButton,
  DigiIconChevronDown,
  DigiIconChevronRight,
  DigiIconX,
} from '@designsystem-se/af-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  EMPLOYMENT_DURATIONS,
  EMPLOYMENT_SCOPES,
  EMPLOYMENT_TYPES,
} from '../../constants/ui'
import './EmploymentFactsPicker.css'

const FILTER_SECTIONS = [
  { id: 'type', label: 'Typ av anställning', options: EMPLOYMENT_TYPES },
  {
    id: 'duration',
    label: 'Längd på anställning',
    options: EMPLOYMENT_DURATIONS,
  },
  { id: 'scope', label: 'Omfattning', options: EMPLOYMENT_SCOPES },
]

const EMPTY = { type: [], duration: [], scope: [] }

export default function EmploymentFactsPicker({ value = EMPTY, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('type')
  const wrapperRef = useRef(null)

  const selections = { ...EMPTY, ...value }

  useEffect(() => {
    if (!isOpen) return
    const onDocClick = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setIsOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [isOpen])

  const activeFilter = useMemo(
    () =>
      FILTER_SECTIONS.find((section) => section.id === activeSection) ??
      FILTER_SECTIONS[0],
    [activeSection],
  )

  const toggleSectionOption = (sectionId, optionValue) => {
    const current = selections[sectionId]
    const next = current.includes(optionValue)
      ? current.filter((entry) => entry !== optionValue)
      : [...current, optionValue]
    onChange?.({ ...selections, [sectionId]: next })
  }

  const toggleAllForSection = (sectionId) => {
    const section = FILTER_SECTIONS.find((entry) => entry.id === sectionId)
    if (!section) return
    const allValues = section.options.map((option) => option.value)
    const isFullySelected = allValues.every((v) =>
      selections[sectionId].includes(v),
    )
    onChange?.({
      ...selections,
      [sectionId]: isFullySelected ? [] : allValues,
    })
  }

  const isSectionFullySelected = (section) =>
    section.options.length > 0 &&
    section.options.every((option) =>
      selections[section.id].includes(option.value),
    )

  const clearAll = () => onChange?.(EMPTY)

  const hasAnySelection = FILTER_SECTIONS.some(
    (section) => selections[section.id].length > 0,
  )

  return (
    <div className="employment-facts-picker" ref={wrapperRef}>
      <div className="employment-facts-picker__trigger-row">
        <div
          className={
            isOpen
              ? 'employment-facts-picker__trigger employment-facts-picker__trigger--open'
              : 'employment-facts-picker__trigger'
          }
        >
          <DigiButton
            afSize={ButtonSize.MEDIUM}
            afVariation={ButtonVariation.SECONDARY}
            afFullWidth
            onAfOnClick={() => setIsOpen((open) => !open)}
          >
            <div className="employment-facts-picker__trigger-content">
              <digi-icon-list-ul></digi-icon-list-ul>
              <span className="employment-facts-picker__trigger-label">
                Fakta anställning
              </span>
              <span
                className={
                  isOpen
                    ? 'employment-facts-picker__chevron employment-facts-picker__chevron--open'
                    : 'employment-facts-picker__chevron'
                }
              >
                <DigiIconChevronDown />
              </span>
              {hasAnySelection && (
                <span
                  className="employment-facts-picker__trigger-dot"
                  aria-hidden="true"
                />
              )}
            </div>
          </DigiButton>
        </div>
      </div>

      {isOpen && (
        <div className="employment-facts-picker__dropdown">
          <div className="employment-facts-picker__top-row">
            <button
              type="button"
              className="employment-facts-picker__text-button"
              onClick={clearAll}
            >
              Rensa alla
            </button>
            <button
              type="button"
              className="employment-facts-picker__close-button"
              onClick={() => setIsOpen(false)}
            >
              <span>Stäng</span>
              <DigiIconX />
            </button>
          </div>

          <div className="employment-facts-picker__content">
            <div className="employment-facts-picker__left-column">
              <h2 className="employment-facts-picker__title">
                Fakta anställning
              </h2>
              <div className="employment-facts-picker__divider" />
              <label className="employment-facts-picker__checkbox-row">
                <input
                  type="checkbox"
                  checked={
                    hasAnySelection &&
                    FILTER_SECTIONS.every((section) =>
                      isSectionFullySelected(section),
                    )
                  }
                  onChange={() => {
                    const shouldSelectAll = !FILTER_SECTIONS.every((section) =>
                      isSectionFullySelected(section),
                    )
                    onChange?.(
                      shouldSelectAll
                        ? Object.fromEntries(
                            FILTER_SECTIONS.map((section) => [
                              section.id,
                              section.options.map((option) => option.value),
                            ]),
                          )
                        : EMPTY,
                    )
                  }}
                />
                <span>Välj alla</span>
              </label>

              <div className="employment-facts-picker__section-list">
                {FILTER_SECTIONS.map((section) => {
                  const isActive = activeSection === section.id
                  const selectedCount = selections[section.id].length
                  return (
                    <button
                      key={section.id}
                      type="button"
                      className={
                        isActive
                          ? 'employment-facts-picker__section-item employment-facts-picker__section-item--active'
                          : 'employment-facts-picker__section-item'
                      }
                      onClick={() => setActiveSection(section.id)}
                    >
                      <span className="employment-facts-picker__section-label">
                        <span>{section.label}</span>
                      </span>
                      <span className="employment-facts-picker__section-indicator">
                        {selectedCount > 0 && (
                          <span
                            className={
                              isActive
                                ? 'employment-facts-picker__section-dot employment-facts-picker__section-dot--active'
                                : 'employment-facts-picker__section-dot'
                            }
                          />
                        )}
                      </span>
                      <span className="employment-facts-picker__section-chevron">
                        <DigiIconChevronRight />
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="employment-facts-picker__right-column">
              <div className="employment-facts-picker__right-header">
                <h3 className="employment-facts-picker__subtitle">
                  {activeFilter.label}
                </h3>
                <button
                  type="button"
                  className="employment-facts-picker__text-button"
                  onClick={() => toggleAllForSection(activeFilter.id)}
                >
                  Rensa
                </button>
              </div>

              <div className="employment-facts-picker__divider employment-facts-picker__divider--compact" />

              <label className="employment-facts-picker__checkbox-row employment-facts-picker__checkbox-row--section">
                <input
                  type="checkbox"
                  checked={isSectionFullySelected(activeFilter)}
                  onChange={() => toggleAllForSection(activeFilter.id)}
                />
                <span>Välj alla</span>
              </label>

              <div className="employment-facts-picker__option-list">
                {activeFilter.options.map((option) => (
                  <label
                    key={option.value}
                    className="employment-facts-picker__option-row"
                  >
                    <input
                      type="checkbox"
                      checked={selections[activeFilter.id].includes(
                        option.value,
                      )}
                      onChange={() =>
                        toggleSectionOption(activeFilter.id, option.value)
                      }
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="employment-facts-picker__footer">
            <button
              type="button"
              className="employment-facts-picker__footer-btn employment-facts-picker__footer-btn--secondary"
              onClick={() => setIsOpen(false)}
            >
              Stäng
            </button>
            <button
              type="button"
              className="employment-facts-picker__footer-btn employment-facts-picker__footer-btn--primary"
              onClick={() => setIsOpen(false)}
            >
              Lägg till och stäng
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
