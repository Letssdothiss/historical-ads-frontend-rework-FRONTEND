import './TrendsFilter.css';
import { useEffect, useRef, useState } from 'react';

import {
  DigiButton,
  DigiIconChart,
  DigiIconChevronDown,
} from '@designsystem-se/af-react';

const TREND_OPTIONS = [
  { value: 'top5_occupations', label: '5 vanligaste yrkesgrupperna' },
  { value: 'top5_skills', label: '5 vanligaste kompetenserna' },
  { value: 'top5_growing', label: '5 yrkesgrupper - ökat mest' },
  { value: 'top5_declining', label: '5 yrkesgrupper - minskat mest' },
];

function TrendsFilter({ value = '', onChange } = {}) {
  // Controls whether the dropdown is open or closed
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

  return (
    <div className="trends-filter" ref={wrapperRef}>
      {/* Trigger button for opening/closing dropdown */}
      <div className="trends-trigger">
        <DigiButton
          afVariation="secondary"
          afSize="medium"
          afFullWidth={true}
          onAfOnClick={() => setIsOpen(!isOpen)}
        >
          <div className="trends-trigger-content">
            {/* Trend icon */}
            <DigiIconChart />

            {/* Button label */}
            <span className="trends-trigger-label">
              Trender
            </span>

            {/* Chevron icon rotates when dropdown is open */}
            <span
              className={
                isOpen
                  ? 'trends-chevron-wrapper open'
                  : 'trends-chevron-wrapper'
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
          {TREND_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={
                value === option.value ? 'trends-option active' : 'trends-option'
              }
              onClick={() => {
                onChange?.(value === option.value ? '' : option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default TrendsFilter;