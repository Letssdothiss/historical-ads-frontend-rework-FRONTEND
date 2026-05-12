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
import { useState } from 'react';

import {
  DigiButton,
  DigiFormCheckbox,
  DigiIconClock,
  DigiIconChevronDown,
  DigiIconChevronRight,
  DigiIconX,
} from '@designsystem-se/af-react';

function TimePeriodFilter() {
  const [isOpen, setIsOpen] = useState(false);

  const [allYearsSelected, setAllYearsSelected] =
    useState(false);

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
    setActiveYear(year);
    setAllYearsSelected(false);
    setSelectedMonths([]);
  };

  const handleSelectAll = () => {
    setAllYearsSelected((previousValue) => {
      const nextValue = !previousValue;

      if (nextValue) {
        setActiveYear(null);
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
    setSelectedMonths([]);
  };

  return (
    <div className="time-period-filter">
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
                {years.map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => handleYearClick(year)}
                    className={
                      activeYear === year
                        ? 'time-period-year-button active'
                        : 'time-period-year-button'
                    }
                  >
                    <span>{year}</span>

                    {allYearsSelected ? (
                      <div className="time-period-active-dot"></div>
                    ) : (
                      <div className="time-period-dot-placeholder"></div>
                    )}

                    <DigiIconChevronRight />
                  </button>
                ))}
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