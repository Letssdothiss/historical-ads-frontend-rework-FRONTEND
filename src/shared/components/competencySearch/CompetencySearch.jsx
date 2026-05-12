import './CompetencySearch.css';

import {
  DigiFormInput,
  DigiIconInfoCircleSolid,
} from '@designsystem-se/af-react';

import {
  FormInputType,
  FormInputVariation,
  FormInputValidation,
} from '@designsystem-se/af';

function CompetencySearch({
  value = '',
  onChange,
}) {
  return (
    <div className="competency-search">
      <div className="competency-search-label-row">
        <p className="competency-search-label">
          Sök på kompetenser
        </p>

        <DigiIconInfoCircleSolid />
      </div>

      <div className="competency-search-input-wrapper">
        <DigiFormInput
          afId="competency-search-input"
          afVariation={FormInputVariation.MEDIUM}
          afType={FormInputType.TEXT}
          afValidation={FormInputValidation.NEUTRAL}
          afPlaceholder="Sök kompetens"
          afValue={value}
          onAfOnInput={(event) =>
            onChange?.(
              event.detail.target.value
            )
          }
        />
      </div>
    </div>
  );
}

export default CompetencySearch;