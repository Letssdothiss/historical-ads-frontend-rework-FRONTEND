import { useEffect, useRef, useState } from 'react'
import './DrivingLicenseFilter.css'

import {
  DigiButton,
  DigiFormCheckbox,
  DigiIconChevronDown,
  DigiIconLicenceCar,
} from '@designsystem-se/af-react'

const REQUIRED = 'required'
const NOT_REQUIRED = 'not-required'

function deriveChecks(value) {
  return {
    required: value === REQUIRED,
    notRequired: value === NOT_REQUIRED || value === 'not_required',
  }
}

// The backend filter is a single boolean (required / not required / unset),
// so checking both boxes is equivalent to no filter.
function toValue({ required, notRequired }) {
  if (required && !notRequired) return REQUIRED
  if (notRequired && !required) return NOT_REQUIRED
  return ''
}

function DrivingLicenseFilter({ onChange, value = '' } = {}) {
  const [isOpen, setIsOpen] = useState(false)
  const [checks, setChecks] = useState(() => deriveChecks(value))
  const lastEmittedRef = useRef(value)
  const wrapperRef = useRef(null)
  const hasSelection = checks.required || checks.notRequired

  useEffect(() => {
    if (value === lastEmittedRef.current) return
    lastEmittedRef.current = value
    setChecks(deriveChecks(value))
  }, [value])

  useEffect(() => {
    const next = toValue(checks)
    if (!onChange || next === lastEmittedRef.current) return
    lastEmittedRef.current = next
    onChange(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checks])

  const toggle = (key) => setChecks((prev) => ({ ...prev, [key]: !prev[key] }))

  useEffect(() => {
    if (!isOpen) return
    const onDocClick = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setIsOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [isOpen])

  return (
    <div className="driving-license-filter" ref={wrapperRef}>
      <div
        className={
          isOpen
            ? 'driving-license-trigger driving-license-trigger--open'
            : 'driving-license-trigger'
        }
      >
        <DigiButton
          afVariation="secondary"
          afSize="medium"
          afFullWidth={true}
          onAfOnClick={() => setIsOpen(!isOpen)}
        >
          <div className="driving-license-trigger-content">
            <DigiIconLicenceCar />

            <span className="driving-license-trigger-label">Körkort</span>

            <span
              className={
                isOpen
                  ? 'driving-license-chevron-wrapper driving-license-chevron-wrapper--open'
                  : 'driving-license-chevron-wrapper'
              }
            >
              <DigiIconChevronDown />
            </span>

            {hasSelection && (
              <span
                className="driving-license-trigger-dot"
                aria-hidden="true"
              />
            )}
          </div>
        </DigiButton>
      </div>

      {isOpen && (
        <div className="driving-license-dropdown">
          <div className="dropdown-content">
            <div className="dropdown-title-row">
              <h2 className="dropdown-title">Körkort</h2>

              <button
                type="button"
                className="dropdown-text-button"
                onClick={() =>
                  setChecks({ required: false, notRequired: false })
                }
              >
                Rensa alla
              </button>
            </div>

            <div className="dropdown-divider"></div>

            <div className="driving-license-options">
              <DigiFormCheckbox
                afLabel="Körkort efterfrågas"
                afName="driving-license-required"
                afChecked={checks.required}
                onAfOnChange={() => toggle('required')}
              />

              <DigiFormCheckbox
                afLabel="Körkort efterfrågas inte"
                afName="driving-license-not-required"
                afChecked={checks.notRequired}
                onAfOnChange={() => toggle('notRequired')}
              />
            </div>
          </div>

          <div className="driving-license-footer">
            <button
              type="button"
              className="driving-license-footer-btn driving-license-footer-btn--secondary"
              onClick={() => setIsOpen(false)}
            >
              Stäng
            </button>
            <button
              type="button"
              className="driving-license-footer-btn driving-license-footer-btn--primary"
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

export default DrivingLicenseFilter
