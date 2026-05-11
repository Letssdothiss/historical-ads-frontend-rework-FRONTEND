import './TabsSwitch.css';
import React, { useState } from 'react';
import { DigiButton, DigiIconCopy } from '@designsystem-se/af-react';
import { ButtonSize, ButtonVariation } from '@designsystem-se/af';

function TabsSwitch() {
  const [activeTab, setActiveTab] = useState("platsannonser");

  return (
    <div className="tab-menu-container">
      <div className="reset-button-container">
        <DigiButton
	        afSize={ButtonSize.SMALL}
	        afVariation={ButtonVariation.FUNCTION}
	        afFullWidth={false}
          afId="form-reset-button"
          >
          <DigiIconCopy />
	        Reset
        </DigiButton>
      </div>
      <div className="tabs-switch-container">
        <DigiButton
          className="tabs-switch__tab-host"
          afId="button-platsannonser"
	        afSize={ButtonSize.MEDIUM}
	        afVariation={
            activeTab === 'platsannonser'
              ? ButtonVariation.PRIMARY
              : ButtonVariation.SECONDARY
          }
	        afFullWidth={false}
          onAfOnClick={() => setActiveTab('platsannonser')}
          >
	        Platsannonser
        </DigiButton>

        <DigiButton
          className="tabs-switch__tab-host"
          afId="button-statistik"
	        afSize={ButtonSize.MEDIUM}
	        afVariation={
            activeTab === 'statistik'
              ? ButtonVariation.PRIMARY
              : ButtonVariation.SECONDARY
          }
	        afFullWidth={false}
          onAfOnClick={() => setActiveTab('statistik')}
          >
	        Statistik
        </DigiButton>

        <DigiButton
          className="tabs-switch__tab-host"
          afId="button-om-datan"
	        afSize={ButtonSize.MEDIUM}
	        afVariation={
            activeTab === 'om-datan'
              ? ButtonVariation.PRIMARY
              : ButtonVariation.SECONDARY
          }
	        afFullWidth={false}
          onAfOnClick={() => setActiveTab("om-datan")}
          >
	        Om datan
        </DigiButton>
      </div>
    </div>
  );
};

export default TabsSwitch;