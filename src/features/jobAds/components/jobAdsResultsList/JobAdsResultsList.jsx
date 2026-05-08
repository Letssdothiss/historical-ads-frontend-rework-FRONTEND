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