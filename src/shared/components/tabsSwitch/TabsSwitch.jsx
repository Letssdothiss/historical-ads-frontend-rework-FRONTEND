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
        <DigiTablist
          afId="tab-switch-button"
          afTabs={[
            {"id":"platsannonser",
              "title":"Platsannonser"
            },
            {"id":"statistik",
              "title":"Statistik"
            },
            {"id":"om-datan",
              "title":"Om datan"
            }
          ]}>
        </DigiTablist>
      </div>
    </div>
  );
};

export default TabsSwitch;