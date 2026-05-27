import { ButtonType, ButtonVariation } from '@designsystem-se/af'
import { DigiButton } from '@designsystem-se/af-react'
import './JobAdsResultCard.css'
/**
 * Formats text values, returning a default placeholder if the value is empty or only whitespace.
 * @param {string} value - The text value to format.
 * @returns {string} - The formatted text or a default placeholder if the input is empty.
 */
function formatText(value) {
  return value?.trim?.() ? value : 'Okänt'
}

function formatDate(value) {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('sv-SE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
    .formatToParts(date)
    .map((part) =>
      part.type === 'month'
        ? part.value.charAt(0).toUpperCase() + part.value.slice(1)
        : part.value,
    )
    .join('')
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

  const adId = ad?.originalId || ad?.id
  const publishedDate =
    ad?.raw?.publication_date || ad?.raw?.published_at || ad?.publishedAt

  return (
    <article className="job-ads-result-card">
      <div className="job-ads-result-card__body">
        <h3 className="job-ads-result-card__title">{formatText(ad?.title)}</h3>

        {adId ? (
          <p className="job-ads-result-card__id">
            <span className="job-ads-result-card__id-label">Annons-ID</span>{' '}
            {adId}
          </p>
        ) : null}

        <p className="job-ads-result-card__meta">{formatText(ad?.employer)}</p>
        <p className="job-ads-result-card__meta">
          {formatText(ad?.occupation)}
        </p>
        <p className="job-ads-result-card__meta">
          {formatText(ad?.municipality)}
        </p>
        <p className="job-ads-result-card__date">{formatDate(publishedDate)}</p>
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
  )
}
