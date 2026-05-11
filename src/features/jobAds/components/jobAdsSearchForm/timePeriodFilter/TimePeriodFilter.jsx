import './TimePeriodFilter.css';
import { useState } from 'react';

import {
  DigiButton,
  DigiIconClock,
  DigiIconChevronDown,
  DigiIconChevronRight,
  DigiIconX,
} from '@designsystem-se/af-react';

function TimePeriodFilter() {
  // Controls whether overlay is open or closed
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="time-period-filter">
      {/* Trigger button */}
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

            {/* Button label */}
            <span className="time-period-trigger-label">
              Tidsperiod
            </span>

            {/* Chevron icon */}
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

      {/* Overlay */}
      {isOpen && (
        <div className="time-period-overlay">
          {/* Top row */}
          <div className="time-period-top-row">
            <button
              type="button"
              className="time-period-clear-button"
            >
              Rensa alla
            </button>

            <button
              type="button"
              className="time-period-close-button"
              onClick={() => setIsOpen(false)}
            >
              <span>Stäng</span>

              <DigiIconX />
            </button>
          </div>

          {/* Columns */}
          <div className="time-period-columns">
            {/* Left column */}
            <div className="time-period-left-column">
              <h2 className="time-period-title">
                Årtal
              </h2>

              <div className="time-period-divider"></div>

              <label className="time-period-checkbox-row">
                <input type="checkbox" />

                <span>Välj alla</span>
              </label>

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

            {/* Empty right column */}
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