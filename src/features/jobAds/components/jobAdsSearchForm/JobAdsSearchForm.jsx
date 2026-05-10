import './JobAdsSearchForm.css';
import React from 'react';
import { DigiFormInput } from '@designsystem-se/af-react';
import { FormInputVariation, FormInputType, FormInputValidation } from '@designsystem-se/af';

function JobAdsSearchForm() {
  return (
    <section className="job-ads-search-form-container">
      <div className="free-text-search-field-container">
        <div className="text-above-free-text-search-input-field">
          <p>Sök på ord i annons och titel</p>
        </div>
        <div className="free-text-search-input-info-button"></div>
        <div className="free-text-input-container">
          <DigiFormInput
            afId="free-text-search-input-field"
	          afVariation={FormInputVariation.MEDIUM}
	          afType={FormInputType.TEXT}
	          afValidation={FormInputValidation.NEUTRAL}			
          >
          </DigiFormInput>
        </div>
      </div>
      <div className="job-ads-dropdown-inputs-container">
        <div className="geographic-area-dropdown-container"></div>
        <div className="time-period-dropdown-container"></div>
        <div className="trade-category-dropdown-container"></div>
        <div className="employment-information-dropdown-container"></div>
      </div>
      <div className="employer-and-trade-input-field-container">
        <div className="employer-input-and-text-container">
          <div className="text-above-employer-input-field">
            <p>Arbetsgivare</p>
          </div>
          <div className="employer-input-field-container">
            <DigiFormInput
              afId="employer-input-field"
	            afVariation={FormInputVariation.MEDIUM}
	            afType={FormInputType.TEXT}
	            afValidation={FormInputValidation.NEUTRAL}			
            >
            </DigiFormInput>
          </div>
        </div>
        <div className="trade-input-and-text-and-info-container">
          <div className="text-above-trade-input-field">
            <p>Sök på kompetenser</p>
          </div>
          <div className="trade-input-info-button"></div>
          <div className="trade-input-field-container">
            <DigiFormInput
              afId="trade-input-field"
	            afVariation={FormInputVariation.MEDIUM}
	            afType={FormInputType.TEXT}
	            afValidation={FormInputValidation.NEUTRAL}			
            >
            </DigiFormInput>
          </div>
        </div>
      </div>
      <div className="search-button-container"></div>
    </section>
  );
};

export default JobAdsSearchForm;