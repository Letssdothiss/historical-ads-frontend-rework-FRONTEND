import {
  ButtonType,
  ButtonVariation,
  CardBorder,
  CardBorderRadius,
} from '@designsystem-se/af'
import { DigiButton, DigiCard } from '@designsystem-se/af-react'
import './JobAdsResultCard.css'
/**
 * Formats text values, returning a default placeholder if the value is empty or only whitespace.
 * @param {string} value - The text value to format.
 * @returns {string} - The formatted text or a default placeholder if the input is empty.
 */
function formatText(value) {
  return value?.trim?.() ? value : 'Okänt'
}
/**
 * Renders a job ad result card.
 * @param {Object} param0 - The props for the component.
 * @param {Object} param0.ad - The job ad data.
 * @param {Function} param0.onViewAd - The function to call when viewing the ad.
 * @returns {JSX.Element} - The rendered component.
 */
export default function JobAdsResultCard({ ad, onViewAd }) {
  const handleViewAd = () => {
    onViewAd?.(ad)
  }

  return (
    <DigiCard
      afBorder={CardBorder.PRIMARY}
      afBorderRadius={CardBorderRadius.PRIMARY}
    >
      <article className="job-ads-result-card">
        <div className="job-ads-result-card__body">
          <div className="job-ads-result-card__title-row">
            <h3 className="job-ads-result-card__title">
              {formatText(ad?.title)}
            </h3>
            {ad?.id ? (
              <span className="job-ads-result-card__id">{ad.id}</span>
            ) : null}
          </div>

          <p className="job-ads-result-card__meta">
            {formatText(ad?.employer)}
          </p>
          <p className="job-ads-result-card__meta">
            {formatText(ad?.occupation)}
          </p>
          <p className="job-ads-result-card__meta">
            {formatText(ad?.municipality)}
          </p>
          <p className="job-ads-result-card__date">
            {formatText(ad?.publishedAt)}
          </p>
        </div>

        <div className="job-ads-result-card__actions">
          <DigiButton
            afType={ButtonType.BUTTON}
            afVariation={ButtonVariation.PRIMARY}
            onAfOnClick={handleViewAd}
          >
            Till annons
          </DigiButton>
        </div>
      </article>
    </DigiCard>
  )
}
