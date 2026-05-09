import './ContentWrapper.css';
import TabsSwitch from '../tabsSwitch/TabsSwitch';
import React from 'react';

function ContentWrapper({ children }) {
  return (
    <section className="shell-section">
      <div className="shell-top-row">
        <div className="shell-header-container">
          <div className="shell-header-content-container">
            <h2>Historiska platsannonser</h2>
            <p>Platsannonser tidigare publicerade på</p>
            <p>Platsbanken</p>
          </div>
        </div>

        <div className="tabsswitch-component-container">
          <TabsSwitch />
        </div>
      </div>

      <div className="shell-form-container">
        {children}
      </div>
    </section>
  );
};

export default ContentWrapper;