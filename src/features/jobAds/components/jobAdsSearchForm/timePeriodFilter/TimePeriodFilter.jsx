/*
 * TimePeriodFilter
 *
 * A dropdown filter component for selecting a time period.
 *
 * Features:
 * - Toggleable overlay
 * - "Select all" checkbox
 * - List of selectable years
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
            {/* Clear filter button */}
            <button
              type="button"
              className="time-period-clear-button"
            >
              Rensa alla
            </button>

            {/* Close overlay button */}
            <button
              type="button"
              className="time-period-close-button"
              onClick={() => setIsOpen(false)}
            >
              <span>Stäng</span>

              <DigiIconX />
            </button>
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
                <DigiFormCheckbox afLabel="Välj alla" />
              </div>

              {/* Year list */}
              <div className="time-period-years">
                <button type="button">
                  <span>2026</span>

                  <DigiIconChevronRight />
                </button>

                <button type="button">
                  <span>2025</span>

                  <DigiIconChevronRight />
                </button>

                <button type="button">
                  <span>2024</span>

                  <DigiIconChevronRight />
                </button>

                <button type="button">
                  <span>2023</span>

                  <DigiIconChevronRight />
                </button>
              </div>
            </div>

            {/* Right column placeholder */}
            <div className="time-period-right-column">
              <div className="time-period-divider"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimePeriodFilter;