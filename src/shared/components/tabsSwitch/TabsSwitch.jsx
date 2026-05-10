import './TabsSwitch.css';
import React from 'react';
import { DigiTablist, DigiButton, DigiIconCopy } from '@designsystem-se/af-react';
import { ButtonSize, ButtonVariation } from '@designsystem-se/af';

function TabsSwitch() {
  return (
    <div className="tab-menu-container">
      <div className="reset-button-container">
        <DigiButton
	        afSize={ButtonSize.SMALL}
	        afVariation={ButtonVariation.FUNCTION}
	        afFullWidth={false}
          afId="form-reset-button"
          >
          <DigiIconCopy></DigiIconCopy>
	        Reset
        </DigiButton>
      </div>
      <div className="tabs-switch-container">
        <DigiButton
          afId="button-platsannonser"
	        afSize={ButtonSize.MEDIUM}
	        afVariation={ButtonVariation.SECONDARY}
	        afFullWidth={false}>
	        Platsannonser
        </DigiButton>

        <DigiButton
          afId="button-statistik"
	        afSize={ButtonSize.MEDIUM}
	        afVariation={ButtonVariation.SECONDARY}
	        afFullWidth={false}>
	        Statistik
        </DigiButton>

        <DigiButton
          afId="button-om-datan"
	        afSize={ButtonSize.MEDIUM}
	        afVariation={ButtonVariation.SECONDARY}
	        afFullWidth={false}>
	        Om datan
        </DigiButton>
      </div>
    </div>
  );
};

export default TabsSwitch;