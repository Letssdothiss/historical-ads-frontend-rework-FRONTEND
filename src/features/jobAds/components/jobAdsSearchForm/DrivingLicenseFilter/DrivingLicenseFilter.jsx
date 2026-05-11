import './DrivingLicenseFilter.css';
import { useState } from 'react';

import {
  DigiButton,
  DigiIconLicenceCar,
  DigiIconChevronDown,
  DigiIconX,
  DigiFormRadiogroup,
  DigiFormRadiobutton,
} from '@designsystem-se/af-react';

function DrivingLicenseFilter() {
  const [isOpen, setIsOpen] = useState(false);
  const [licenseChoice, setLicenseChoice] = useState('');

  return (
    <div className="driving-license-filter">
      <div className="driving-license-trigger">
        <DigiButton
          afVariation="secondary"
          afSize="medium"
          afFullWidth={true}
          onAfOnClick={() => setIsOpen(!isOpen)}
        >
          <div className="driving-license-trigger-content">
            <DigiIconLicenceCar />

            <span className="driving-license-trigger-label">
              Körkort
            </span>

            <span
              className={
                isOpen
                  ? 'driving-license-chevron-wrapper open'
                  : 'driving-license-chevron-wrapper'
              }
            >
              <DigiIconChevronDown />
            </span>
          </div>
        </DigiButton>
      </div>

      {isOpen && (
        <div className="driving-license-dropdown">
          <div className="dropdown-header">
            <button
              type="button"
              className="dropdown-text-button"
              onClick={() => setLicenseChoice('')}
            >
              Rensa
            </button>

            <button
              type="button"
              className="dropdown-close-button"
              onClick={() => setIsOpen(false)}
            >
              <span>Stäng</span>

              <DigiIconX />
            </button>
          </div>

          <div className="dropdown-content">
            <h2 className="dropdown-title">
              Körkort
            </h2>

            <div className="dropdown-divider"></div>

            <DigiFormRadiogroup afName="driving-license-group">
              <DigiFormRadiobutton
                afLabel="Körkort efterfrågas"
                afName="driving-license-group"
                afValue="required"
                afChecked={licenseChoice === 'required'}
                onAfOnChange={() =>
                  setLicenseChoice('required')
                }
              />

              <DigiFormRadiobutton
                afLabel="Körkort efterfrågas inte"
                afName="driving-license-group"
                afValue="not-required"
                afChecked={licenseChoice === 'not-required'}
                onAfOnChange={() =>
                  setLicenseChoice('not-required')
                }
              />
            </DigiFormRadiogroup>
          </div>
        </div>
      )}
    </div>
  );
}

export default DrivingLicenseFilter;