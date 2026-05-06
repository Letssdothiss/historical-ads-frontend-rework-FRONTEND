import React from 'react';
import { DigiLayoutBlock } from '@designsystem-se/af-react';
import { LayoutBlockVariation } from '@designsystem-se/af';

const ContentWrapper = () => {
  return (
    <div className="context-container">
      <DigiLayoutBlock afVariation={LayoutBlockVariation.SECONDARY}>
        <div className="context-content-container">
          <h2>Historiska platsannonser</h2>
          <p>Sök data från platsannonser tidigare</p>
          <p>publicerade på Platsbanken</p>
        </div>
      </DigiLayoutBlock>
    </div>
  )
}

export default ContentWrapper;