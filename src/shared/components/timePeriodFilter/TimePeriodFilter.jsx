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

import './TimePeriodFilter.css';
import { useEffect, useRef, useState } from 'react';

import {
  DigiButton,
  DigiFormCheckbox,
  DigiIconClock,
  DigiIconChevronDown,
  DigiIconChevronRight,
  DigiIconX,
} from '@designsystem-se/af-react';

function TimePeriodFilter({ onChange } = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const onDocClick = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [isOpen]);

  const [allYearsSelected, setAllYearsSelected] =
    useState(false);

  // The years the user has chosen as filter values.
  const [selectedYears, setSelectedYears] = useState([]);

  // Which year's months panel is currently shown (visual focus only).
  const [activeYear, setActiveYear] = useState(null);

  const [selectedMonths, setSelectedMonths] =
    useState([]);

  const years = ['2026', '2025', '2024', '2023'];

  const months = [
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
  ];

  const handleYearClick = (year) => {
    setAllYearsSelected(false);
    setActiveYear(year);
    setSelectedYears((previousYears) =>
      previousYears.includes(year)
        ? previousYears.filter((entry) => entry !== year)
        : [...previousYears, year]
    );
  };

  const handleSelectAll = () => {
    setAllYearsSelected((previousValue) => {
      const nextValue = !previousValue;

      if (nextValue) {
        setActiveYear(null);
        setSelectedYears([]);
      }

      return nextValue;
    });
  };

  const handleSelectAllMonths = () => {
    if (selectedMonths.length === months.length) {
      setSelectedMonths([]);
    } else {
      setSelectedMonths(months);
    }
  };

  const handleMonthClick = (month) => {
    setSelectedMonths((previousMonths) =>
      previousMonths.includes(month)
        ? previousMonths.filter(
            (selectedMonth) =>
              selectedMonth !== month
          )
        : [...previousMonths, month]
    );
  };

  const handleClearAll = () => {
    setAllYearsSelected(false);
    setActiveYear(null);
    setSelectedYears([]);
    setSelectedMonths([]);
  };

  useEffect(() => {
    if (!onChange) return;
    onChange({
      years: allYearsSelected ? years : selectedYears,
      months: selectedMonths,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allYearsSelected, selectedYears, selectedMonths]);

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

            <span className="time-period-trigger-label">
              Tidsperiod
            </span>

            <span
              className={
                isOpen
                  ? 'time-period-chevron-wrapper open'
                  : 'time-period-chevron-wrapper'
              }
            >
              <DigiIconChevronDown />
            </span>
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
                    onClick={() => setSelectedMonths([])}
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
              <h2 className="time-period-title">
                Årtal
              </h2>

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

                <span className="time-period-title">
                  Välj alla årtal
                </span>
              </button>

              <div className="time-period-years">
                {years.map((year) => {
                  const isActive = activeYear === year;
                  const isSelected =
                    allYearsSelected || selectedYears.includes(year);
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
                      <span>{year}</span>

                      {isSelected ? (
                        <div
                          className={
                            isActive
                              ? 'time-period-active-dot time-period-active-dot--on-active'
                              : 'time-period-active-dot'
                          }
                        ></div>
                      ) : (
                        <div className="time-period-dot-placeholder"></div>
                      )}

                      <DigiIconChevronRight />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="time-period-right-column">
              {(activeYear || allYearsSelected) && (
                <>
                  <h2 className="time-period-title">
                    Månader
                  </h2>

                  <div className="time-period-divider"></div>

                  <button
                    type="button"
                    className="time-period-checkbox-row"
                    onClick={handleSelectAllMonths}
                  >
                    <DigiFormCheckbox
                      afChecked={
                        selectedMonths.length ===
                        months.length
                      }
                      onAfOnChange={
                        handleSelectAllMonths
                      }
                    />

                    <span className="time-period-title">
                      {activeYear
                        ? `Välj alla månader ${activeYear}`
                        : 'Välj alla månader'}
                    </span>
                  </button>

                  <div className="time-period-months">
                    {months.map((month) => (
                      <div
                        key={month}
                        className="time-period-month-row"
                      >
                        <DigiFormCheckbox
                          afLabel={month}
                          afChecked={selectedMonths.includes(
                            month
                          )}
                          onAfOnChange={() =>
                            handleMonthClick(month)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimePeriodFilter;