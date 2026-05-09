import './ContentWrapper.css';
import TabsSwitch from '../tabsSwitch/TabsSwitch';
import React from 'react';
import { DigiLayoutBlock } from '@designsystem-se/af-react';

function ContentWrapper({ children }) {
  return (
    <section className="shell-section">
      <div className="shell-header-container">
        <DigiLayoutBlock>
          <div className="shell-header-content-container">
            <h2>Historiska platsannonser</h2>
            <p>Platsannonser tidigare publicerade på</p>
            <p>Platsbanken</p>
          </div>
        </DigiLayoutBlock>
      </div>

      <div className="tabsswitch-component-container">
        <TabsSwitch />
      </div>

      <div className="shell-form-container">
        {children}
      </div>
    </section>
  );
};

export default ContentWrapper;