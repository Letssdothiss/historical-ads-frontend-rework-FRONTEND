import './TrendsFilter.css';
import { useState } from 'react';

import {
  DigiButton,
  DigiIconChart,
  DigiIconChevronDown,
} from '@designsystem-se/af-react';

function TrendsFilter() {
  // Controls whether the dropdown is open or closed
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="trends-filter">
      {/* Trigger button for opening/closing dropdown */}
      <div className="trends-trigger">
        <DigiButton
          afVariation="secondary"
          afSize="medium"
          afFullWidth={true}
          onAfOnClick={() => setIsOpen(!isOpen)}
        >
          <div className="trigger-content">
            {/* Trend icon */}
            <DigiIconChart />

            {/* Button label */}
            <span className="trigger-label">
              Trender
            </span>

            {/* Chevron icon rotates when dropdown is open */}
            <span
              className={
                isOpen
                  ? 'chevron-wrapper open'
                  : 'chevron-wrapper'
              }
            >
              <DigiIconChevronDown />
            </span>
          </div>
        </DigiButton>
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="trends-dropdown">
          {/* Trend options */}
          <button type="button">
            5 vanligaste yrkesgrupperna
          </button>

          <button type="button">
            5 vanligaste kompetenserna
          </button>

          <button type="button">
            5 yrkesgrupper - ökat mest
          </button>

          <button type="button">
            5 yrkesgrupper - minskat mest
          </button>
        </div>
      )}
    </div>
  );
}

export default TrendsFilter;