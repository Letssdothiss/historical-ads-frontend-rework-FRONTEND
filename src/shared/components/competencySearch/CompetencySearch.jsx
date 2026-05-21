import './CompetencySearch.css'

import { DigiFormInput } from '@designsystem-se/af-react'

import {
  FormInputType,
  FormInputVariation,
  FormInputValidation,
} from '@designsystem-se/af'

import InfoTooltip from '../infoTooltip/InfoTooltip'

function CompetencySearch({ value = '', onChange }) {
  return (
    <div className="competency-search">
      <div className="competency-search-label-row">
        <p className="competency-search-label">Sök på kompetenser</p>

        <InfoTooltip label="Information om kompetenssökning">
          Sökfältet gör det möjligt att söka efter kompetenser. På grund av
          begränsningar av databasen kan den vara ofullständig. Kompetenser
          hämtas från fälten must-have, nice-to-have samt berikade variabler.
        </InfoTooltip>
      </div>

      <div className="competency-search-input-wrapper">
        <DigiFormInput
          afId="competency-search-input"
          afLabel="Sök på kompetenser"
          afVariation={FormInputVariation.MEDIUM}
          afType={FormInputType.TEXT}
          afValidation={FormInputValidation.NEUTRAL}
          afPlaceholder="Sök kompetens"
          afValue={value}
          onAfOnInput={(event) => onChange?.(event.detail.target.value)}
        />
      </div>
    </div>
  )
}

export default CompetencySearch
