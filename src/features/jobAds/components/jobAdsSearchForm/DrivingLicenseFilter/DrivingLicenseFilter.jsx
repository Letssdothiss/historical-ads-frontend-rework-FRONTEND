import './DrivingLicenseFilter.css';
import { useState } from 'react';

import {
  DigiButton,
  DigiIconLicenceCar,
  DigiIconChevronDown,
} from '@designsystem-se/af-react';

function DrivingLicenseFilter() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="driving-license-filter">

      <p>Körkorts-knapp utan dropdown-funktion implementerad.</p>

      <DigiButton
        afVariation="secondary"
        afSize="medium"
        onAfOnClick={() => setIsOpen(!isOpen)}
      >
        <DigiIconLicenceCar slot="icon" />

        Körkort

        <span
          slot="icon-secondary"
          className={isOpen ? 'chevron-wrapper open' : 'chevron-wrapper'}
        >
          <DigiIconChevronDown />
        </span>
      </DigiButton>
    </div>
  );
}

export default DrivingLicenseFilter;