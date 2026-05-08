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
/**
 * Renders the job ads results list, handling loading, error, and empty states.
 * @param {Object} param0 - The props for the component.
 * @param {Array} param0.ads - The list of job ads to display.
 * @param {boolean} param0.isLoading - Whether the job ads are currently loading.
 * @param {boolean} param0.isError - Whether an error occurred while fetching job ads.
 * @param {Object} param0.error - The error object, if an error occurred.
 * @param {Function} param0.onViewAd - The function to call when viewing a job ad.
 * @param {Function} param0.onRetry - The function to call when retrying the job ad fetch.
 * @returns {JSX.Element} - The rendered component.
 */
export default function JobAdsResultsList({
  ads,
  isLoading,
  isError,
  error,
  onViewAd,
  onRetry,
}) {
  if (isLoading) {
    return <LoadingState message="Söker annonser..." />
  }

  if (isError) {
    return (
      <ErrorState
        message={error?.message || 'Något gick fel.'}
        onRetry={onRetry}
      />
    )
  }

  if (!ads || ads.length === 0) {
    return (
      <div className="job-ads-results-list__state">
        <p>Inga annonser hittades. Prova att ändra sökkriterier.</p>
      </div>
    )
  }

  return (
    <ul className="job-ads-results-list" aria-label="Sökresultat" id="results">
      {ads.map((ad, index) => (
        <li className="job-ads-results-list__item" key={ad.id || index}>
          <JobAdsResultCard ad={ad} onViewAd={() => onViewAd?.(ad, index)} />
        </li>
      ))}
    </ul>
  )
}
