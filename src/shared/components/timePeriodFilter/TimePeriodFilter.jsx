/*
 * TimePeriodFilter
 *
 * A dropdown filter component for selecting a time period.
 *
 * Features:
 * - Toggleable overlay
 * - "Select all" checkbox
 * - List of selectable years
 * - Active indicator dots for selected years
 * - Month selection view for active year
 * - Uses Digi design system components
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import './TimePeriodFilter.css'

import {
  DigiButton,
  DigiFormCheckbox,
  DigiIconChevronDown,
  DigiIconChevronRight,
  DigiIconClock,
  DigiIconX,
} from '@designsystem-se/af-react'

const YEAR_OPTIONS = ['2026', '2025', '2024', '2023']

const MONTH_OPTIONS = [
  'Januari',
  'Februari',
  'Mars',
  'April',
  'Maj',
  'Juni',
  'Juli',
  'Augusti',
  'September',
  'Oktober',
  'November',
  'December',
]

// Months are emitted year-qualified (`"2026-01"`) so each month stays tied to
// the year it was picked under — that keeps "Januari 2026" distinct from a
// whole-year or cross-year selection once it round-trips through the URL.
function getTimePeriodPayload(
  allYearsSelected,
  selectedYears,
  selectedMonthsByYear,
) {
  const months = []
  for (const [year, monthNames] of Object.entries(selectedMonthsByYear)) {
    for (const monthName of monthNames) {
      const index = MONTH_OPTIONS.indexOf(monthName)
      if (index >= 0) months.push(`${year}-${String(index + 1).padStart(2, '0')}`)
    }
  }
  return {
    years: allYearsSelected ? YEAR_OPTIONS : selectedYears,
    months,
  }
}

function applyTimePeriodValue(value) {
  if (!value) return null
  const selectedYearList = value.years ?? []
  const monthList = value.months ?? []
  const allYearsSelected =
    selectedYearList.length > 0 &&
    YEAR_OPTIONS.every((year) => selectedYearList.includes(year))
  const activeYears = allYearsSelected ? YEAR_OPTIONS : selectedYearList
  const selectedMonthsByYear = createEmptyMonthsByYear()
  // Legacy bare month names (older URLs) apply to every active year.
  const bareMonths = monthList.filter((month) => MONTH_OPTIONS.includes(month))
  for (const year of activeYears) {
    selectedMonthsByYear[year] = [...bareMonths]
  }
  for (const entry of monthList) {
    const qualified = /^(\d{4})-(\d{1,2})$/.exec(String(entry))
    if (!qualified) continue
    const year = qualified[1]
    const monthName = MONTH_OPTIONS[Number(qualified[2]) - 1]
    if (monthName && selectedMonthsByYear[year]) {
      selectedMonthsByYear[year] = [
        ...new Set([...selectedMonthsByYear[year], monthName]),
      ]
    }
  }
  return {
    allYearsSelected,
    selectedYears: allYearsSelected ? [] : selectedYearList,
    selectedMonthsByYear,
    activeYear: null,
  }
}

function createEmptyMonthsByYear() {
  return YEAR_OPTIONS.reduce((acc, year) => ({ ...acc, [year]: [] }), {})
}

function getInitialTimePeriodState(initialPeriod) {
  const applied = applyTimePeriodValue(initialPeriod)
  if (applied) return applied
  return {
    allYearsSelected: false,
    selectedYears: [],
    selectedMonthsByYear: createEmptyMonthsByYear(),
    activeYear: null,
  }
}

function TimePeriodFilter({ onChange, initialPeriod } = {}) {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    const onDocClick = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setIsOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [isOpen])

  const [initial] = useState(() => getInitialTimePeriodState(initialPeriod))
  const [allYearsSelected, setAllYearsSelected] = useState(
    initial.allYearsSelected,
  )
  const [selectedYears, setSelectedYears] = useState(initial.selectedYears)
  const [activeYear, setActiveYear] = useState(initial.activeYear)
  const [selectedMonthsByYear, setSelectedMonthsByYear] = useState(
    initial.selectedMonthsByYear,
  )

  const years = YEAR_OPTIONS
  const months = MONTH_OPTIONS

  // Get all selected months across all years
  const allSelectedMonths = Object.values(selectedMonthsByYear).flat()

  const monthTargetYears = useMemo(() => {
    if (allYearsSelected) return years
    if (activeYear) return [activeYear]
    return selectedYears
  }, [allYearsSelected, activeYear, selectedYears, years])

  const allMonthsSelected =
    monthTargetYears.length > 0 &&
    monthTargetYears.every(
      (year) => (selectedMonthsByYear[year] || []).length === months.length,
    )

  const isMonthChecked = (month) =>
    monthTargetYears.length > 0 &&
    monthTargetYears.every((year) =>
      (selectedMonthsByYear[year] || []).includes(month),
    )

  // Show indicator dot if any years or months are selected.
  const hasSelection =
    allYearsSelected || selectedYears.length > 0 || allSelectedMonths.length > 0

  const handleYearClick = (year) => {
    setAllYearsSelected(false)
    setActiveYear(year)
    setSelectedYears((previousYears) =>
      previousYears.includes(year)
        ? previousYears.filter((entry) => entry !== year)
        : [...previousYears, year],
    )
  }

  const handleSelectAll = () => {
    setAllYearsSelected((previousValue) => {
      const nextValue = !previousValue
      setActiveYear(null)
      setSelectedYears([])
      if (!nextValue) {
        setSelectedMonthsByYear(createEmptyMonthsByYear())
      }
      return nextValue
    })
  }

  const handleSelectAllMonths = () => {
    if (monthTargetYears.length === 0) return

    const shouldSelectAllMonths = monthTargetYears.some(
      (year) => (selectedMonthsByYear[year] || []).length !== months.length,
    )

    setSelectedMonthsByYear({
      ...selectedMonthsByYear,
      ...Object.fromEntries(
        monthTargetYears.map((year) => [
          year,
          shouldSelectAllMonths ? months : [],
        ]),
      ),
    })
  }

  const handleMonthClick = (month) => {
    if (monthTargetYears.length === 0) return
    const shouldCheck = !isMonthChecked(month)
    setSelectedMonthsByYear({
      ...selectedMonthsByYear,
      ...Object.fromEntries(
        monthTargetYears.map((year) => {
          const current = selectedMonthsByYear[year] || []
          return [
            year,
            shouldCheck
              ? [...new Set([...current, month])]
              : current.filter((selectedMonth) => selectedMonth !== month),
          ]
        }),
      ),
    })
  }

  const handleClearAll = () => {
    setAllYearsSelected(false)
    setActiveYear(null)
    setSelectedYears([])
    setSelectedMonthsByYear(
      years.reduce((acc, year) => ({ ...acc, [year]: [] }), {}),
    )
  }

  useEffect(() => {
    if (!onChange) return
    onChange(
      getTimePeriodPayload(
        allYearsSelected,
        selectedYears,
        selectedMonthsByYear,
      ),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allYearsSelected, selectedYears, selectedMonthsByYear])

  return (
    <div className="time-period-filter" ref={wrapperRef}>
      <div className="time-period-trigger">
        <DigiButton
          afVariation="secondary"
          afSize="medium"
          afFullWidth={true}
          onAfOnClick={() => setIsOpen(!isOpen)}
        >
          <div className="time-period-trigger-content">
            <DigiIconClock />

            <span className="time-period-trigger-label">Tidsperiod</span>

            <span
              className={
                isOpen
                  ? 'time-period-chevron-wrapper open'
                  : 'time-period-chevron-wrapper'
              }
            >
              <DigiIconChevronDown />
            </span>

            {hasSelection && (
              <span className="time-period-trigger-dot" aria-hidden="true" />
            )}
          </div>
        </DigiButton>
      </div>

      {isOpen && (
        <div className="time-period-overlay">
          <div className="time-period-top-row">
            <button
              type="button"
              className="time-period-clear-button"
              onClick={handleClearAll}
            >
              Rensa alla
            </button>

            <div className="time-period-top-actions">
              <div className="time-period-right-actions-row">
                {(activeYear || allYearsSelected) && (
                  <button
                    type="button"
                    className="time-period-clear-button"
                    onClick={() => {
                      if (activeYear) {
                        setSelectedMonthsByYear({
                          ...selectedMonthsByYear,
                          [activeYear]: [],
                        })
                      }
                    }}
                  >
                    Rensa
                  </button>
                )}

                <button
                  type="button"
                  className="time-period-close-button"
                  onClick={() => setIsOpen(false)}
                >
                  <span>Stäng</span>

                  <DigiIconX />
                </button>
              </div>
            </div>
          </div>

          <div className="time-period-columns">
            <div className="time-period-left-column">
              <h2 className="time-period-title">Årtal</h2>

              <div className="time-period-divider"></div>

              <button
                type="button"
                className="time-period-checkbox-row"
                onClick={handleSelectAll}
              >
                <DigiFormCheckbox
                  afChecked={allYearsSelected}
                  onAfOnChange={handleSelectAll}
                />

                <span className="time-period-title">Välj alla årtal</span>
              </button>

              <div className="time-period-years">
                {years.map((year) => {
                  const isActive = activeYear === year
                  const yearHasMonths =
                    allYearsSelected ||
                    (selectedMonthsByYear[year] || []).length > 0
                  return (
                    <button
                      key={year}
                      type="button"
                      onClick={() => handleYearClick(year)}
                      className={
                        isActive
                          ? 'time-period-year-button active'
                          : 'time-period-year-button'
                      }
                    >
                      <span className="time-period-year-label">
                        <span>{year}</span>
                      </span>

                      <span className="time-period-year-indicator">
                        {yearHasMonths ? (
                          <div
                            className={
                              isActive
                                ? 'time-period-year-dot time-period-year-dot--on-active'
                                : 'time-period-year-dot'
                            }
                          ></div>
                        ) : (
                          <div className="time-period-year-dot-placeholder"></div>
                        )}
                      </span>

                      <DigiIconChevronRight />
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="time-period-right-column">
              {(activeYear || allYearsSelected) && (
                <>
                  <h2 className="time-period-title">Månader</h2>

                  <div className="time-period-divider"></div>

                  <button
                    type="button"
                    className="time-period-checkbox-row"
                    onClick={handleSelectAllMonths}
                  >
                    <DigiFormCheckbox
                      afChecked={allMonthsSelected}
                      onAfOnChange={handleSelectAllMonths}
                    />

                    <span className="time-period-title">
                      {activeYear
                        ? `Välj alla månader ${activeYear}`
                        : 'Välj alla månader'}
                    </span>
                  </button>

                  <div className="time-period-months">
                    {months.map((month) => (
                      <div key={month} className="time-period-month-row">
                        <DigiFormCheckbox
                          afLabel={month}
                          afChecked={isMonthChecked(month)}
                          onAfOnChange={() => handleMonthClick(month)}
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="time-period-footer">
            <button
              type="button"
              className="time-period-footer-btn time-period-footer-btn--secondary"
              onClick={() => setIsOpen(false)}
            >
              Stäng
            </button>
            <button
              type="button"
              className="time-period-footer-btn time-period-footer-btn--primary"
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

export default TimePeriodFilter
