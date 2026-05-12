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
  // Controls whether the filter overlay is visible
  const [isOpen, setIsOpen] = useState(false);

  // Controls whether all years are selected
  const [allYearsSelected, setAllYearsSelected] =
    useState(false);

  // Stores selected year for month view
  const [activeYear, setActiveYear] = useState(null);

  // Stores selected months
  const [selectedMonths, setSelectedMonths] =
    useState([]);

  // Available years
  const years = ['2026', '2025', '2024', '2023'];

  // Available months
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

  // Toggle single year
  const handleYearClick = (year) => {
    setActiveYear(year);
    setAllYearsSelected(false);
    setSelectedMonths([]);
  };

  // Toggle all years
  const handleSelectAll = () => {
    setAllYearsSelected((previousValue) => {
      const nextValue = !previousValue;

      // Remove active year when selecting all
      if (nextValue) {
        setActiveYear(null);
      }

      return nextValue;
    });
  };

  // Toggle all months
  const handleSelectAllMonths = () => {
    if (selectedMonths.length === months.length) {
      setSelectedMonths([]);
    } else {
      setSelectedMonths(months);
    }
  };

  // Toggle single month
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

  // Clears all selected years
  const handleClearAll = () => {
    setAllYearsSelected(false);
    setActiveYear(null);
    setSelectedMonths([]);
  };

  return (
    <div className="time-period-filter">
      {/* Filter trigger button */}
      <div className="time-period-trigger">
        <DigiButton
          afVariation="secondary"
          afSize="medium"
          afFullWidth={true}
          onAfOnClick={() => setIsOpen(!isOpen)}
        >
          <div className="time-period-trigger-content">
            {/* Clock icon */}
            <DigiIconClock />

            {/* Trigger label */}
            <span className="time-period-trigger-label">
              Tidsperiod
            </span>

            {/* Expand/collapse chevron */}
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

      {/* Dropdown overlay */}
      {isOpen && (
        <div className="time-period-overlay">
          {/* Overlay top actions */}
          <div className="time-period-top-row">
            {/* Left */}
            <button
              type="button"
              className="time-period-clear-button"
              onClick={handleClearAll}
            >
              Rensa alla
            </button>

            {/* Center */}
            <div className="time-period-top-middle">
              {activeYear && (
                <button
                  type="button"
                  className="time-period-clear-button"
                >
                  Rensa
                </button>
              )}
            </div>

            {/* Right */}
            <div className="time-period-top-actions">
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

          {/* Two-column layout */}
          <div className="time-period-columns">
            {/* Left column */}
            <div className="time-period-left-column">
              {/* Section title */}
              <h2 className="time-period-title">
                Årtal
              </h2>

              {/* Section divider */}
              <div className="time-period-divider"></div>

              {/* Select all checkbox */}
              <div className="time-period-checkbox-row">
                <DigiFormCheckbox
                  afLabel="Välj alla årtal"
                  afChecked={allYearsSelected}
                  onAfOnChange={handleSelectAll}
                />
              </div>

              {/* Year list */}
              <div className="time-period-years">
                {years.map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => handleYearClick(year)}
                  >
                    <span>{year}</span>

                    {/* Active selection indicator only shown when "Select all" is active */}
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

            {/* Right column */}
            <div className="time-period-right-column">
              {/* Show month section when a year is selected */}
              {activeYear && (
                <>
                  {/* Section title */}
                  <h2 className="time-period-title">
                    Månader
                  </h2>

                  {/* Section divider */}
                  <div className="time-period-divider"></div>

                  {/* Month select all checkbox */}
                  <div className="time-period-checkbox-row">
                    <DigiFormCheckbox
                      afLabel={`Välj alla månader ${activeYear}`}
                      afChecked={
                        selectedMonths.length ===
                        months.length
                      }
                      onAfOnChange={
                        handleSelectAllMonths
                      }
                    />
                  </div>

                  {/* Month list */}
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