import { ButtonType, ButtonVariation } from '@designsystem-se/af'
import { DigiButton } from '@designsystem-se/af-react'
import JobAdsResultCard from '../jobAdsResultCard/JobAdsResultCard'
import './JobAdsResultsList.css'
/**
 * Renders the job ads results list, handling loading, error, and empty states.
 * @param {Object} param0 - The props for the component.
 * @returns {JSX.Element} - The rendered component.
 */
function LoadingState({ message }) {
  return (
    <div className="job-ads-results-list__state" aria-live="polite">
      <p>{message}</p>
    </div>
  )
}
/**
 * Renders the error state for the job ads results list.
 * @param {Object} param0 - The props for the component.
 * @param {string} param0.message - The error message to display.
 * @param {Function} param0.onRetry - The function to call when retrying.
 * @returns {JSX.Element} - The rendered component.
 */
function ErrorState({ message, onRetry }) {
  return (
    <div className="job-ads-results-list__state job-ads-results-list__state--error">
      <p>{message}</p>
      {onRetry ? (
        <DigiButton
          afType={ButtonType.BUTTON}
          afVariation={ButtonVariation.SECONDARY}
          onAfOnClick={onRetry}
        >
          Försök igen
        </DigiButton>
      ) : null}
    </div>
  )
}
