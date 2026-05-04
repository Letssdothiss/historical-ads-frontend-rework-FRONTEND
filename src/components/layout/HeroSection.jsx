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

    {/*}
      <div className="context-container">
        <DigiLayoutBlock afVariation={LayoutBlockVariation.SECONDARY}>
          <div className="context-content-container">
            <h2>Historiska platsannonser</h2>
            <p>Sök data från platsannonser tidigare</p>
            <p>publicerade på Platsbanken</p>
          </div>
        </DigiLayoutBlock>
      </div>
    */}

      <div className="content-container"></div>

      <div className="footer-container">
        <DigiFooter />
      </div>
    </section>
  );
};

export default HeroSection;