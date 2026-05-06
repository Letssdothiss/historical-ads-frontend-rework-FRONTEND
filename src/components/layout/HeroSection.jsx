import React from 'react';
import { DigiLayoutBlock, DigiLogo } from '@designsystem-se/af-react'
import { LayoutBlockVariation, LogoColor } from '@designsystem-se/af'
import DigiFooter from './DigiFooter';

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

      <div className="content-container"></div>

      <div className="footer-container">
        <DigiFooter />
      </div>
    </section>
  );
};

export default HeroSection;