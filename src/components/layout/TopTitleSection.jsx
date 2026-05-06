import React from 'react';
import { DigiLogo } from '@designsystem-se/af-react'
import { LogoColor } from '@designsystem-se/af'


const HeroSection = () => {
  return (
    <section id="layout-section">
      <div className="logo-container">
        <DigiLogo
          afOnlySymbol={false}
          afColor={LogoColor.PRIMARY}
        ></DigiLogo>
      </div>
      <div className="logo-divider" aria-hidden="true"></div>
    </section>
  );
};

export default HeroSection;