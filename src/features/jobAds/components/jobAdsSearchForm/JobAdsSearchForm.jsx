import './JobAdsSearchForm.css';
import React from 'react';
import { DigiFormReceipt } from '@designsystem-se/af-react';


function JobAdsSearchForm() {
  return (
    <div className="job-ads-search-form-container">
      <digi-form-receipt
	      af-text="Placeholder text, Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos."
	      af-variation="fullwidth"
	      af-type="center"
      >
      </digi-form-receipt>
    </div>
  );
};

export default JobAdsSearchForm;