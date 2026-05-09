import './MainHeader.css';
import React from 'react';
import { DigiLayoutBlock, DigiLogo } from '@designsystem-se/af-react'
import { LayoutBlockVariation, LogoColor } from '@designsystem-se/af'


const MainHeader = () => {
  return (
    <section id="layout-section">
      <div className="logo-container">
        <DigiLogo
          afOnlySymbol={false}
          afColor={LogoColor.PRIMARY}
        ></DigiLogo>
      </div>
      <div className="logo-divider" aria-hidden="true"></div>

      <div className="context-container">
        <DigiLayoutBlock afVariation={LayoutBlockVariation.SECONDARY}>
          <div className="context-content-container">
            <h2>Historiska platsannonser</h2>
            <p className="context-content-container-p">Sök data från platsannonser tidigare</p>
            <p className="context-content-container-p">publicerade på Platsbanken</p>
          </div>
        </DigiLayoutBlock>
      </div>
    </section>
  );
};

export default MainHeader;