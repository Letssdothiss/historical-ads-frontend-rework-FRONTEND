import { ButtonVariation } from '@designsystem-se/af'
import { DigiButton } from '@designsystem-se/af-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MainLayout from '../../app/layout/MainLayout'
import { jobAdsApi } from '../../features/jobAds/api/jobAdsApi'
import { mapHitToAd } from '../../features/jobAds/api/jobAdsMapper'
import ContentWrapper from '../../shared/components/contentWrapper/ContentWrapper'
import { buildAdDetailPath, ROUTES } from '../../shared/constants/routes'
import './JobAdDetailPage.css'

function readResultContext() {
  try {
    const raw = sessionStorage.getItem('jobAds:lastResultIds')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed?.ids)) return null
    return parsed
  } catch {
    return null
  }
}

export default function JobAdDetailPage() {
  const { adId } = useParams()
  const navigate = useNavigate()
  const [ad, setAd] = useState(null)
  const [metadata, setMetadata] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let alive = true
    setIsLoading(true)
    setError(null)
    jobAdsApi
      .getAd(adId, true)
      .then((res) => {
        if (!alive) return
        const adData = res?.ad ?? res
        setAd(mapHitToAd(adData))
        setMetadata(res?.metadata ?? null)
      })
      .catch((err) => alive && setError(err))
      .finally(() => alive && setIsLoading(false))
    return () => {
      alive = false
    }
  }, [adId])

  const resultContext = useMemo(() => readResultContext(), [])
  const nextAdId = useMemo(() => {
    if (!resultContext?.ids?.length) return null
    const index = resultContext.ids.indexOf(adId)
    if (index === -1) return null
    return resultContext.ids[index + 1] ?? null
  }, [resultContext, adId])

  const backToResults = () => {
    const search = resultContext?.query ? `?${resultContext.query}` : ''
    navigate(`${ROUTES.JOB_ADS_RESULTS}${search}`)
  }

  const goNextAd = () => {
    if (nextAdId) navigate(buildAdDetailPath(nextAdId))
  }

  const source = ad?.raw ?? {}
  const qualifications = source.must_have ?? source.qualifications ?? {}
  const description = ad?.description || source.description?.text || ''
  const salaryType =
    source.salary_type?.label ?? source.salary_description ?? '–'
  const postalCode = source.workplace_address?.postcode ?? '–'
  const city = source.workplace_address?.city ?? '–'
  const municipality = ad?.municipality ?? '–'

  return (
    <MainLayout>
      <ContentWrapper hideRensaLink>
        <button
          type="button"
          className="job-ad-detail__nav-toggle"
          onClick={() => navigate(-1)}
        >
          Justera sökning
        </button>
      </ContentWrapper>

      <div className="job-ad-detail">
        <div className="job-ad-detail__nav">
          <button
            type="button"
            className="job-ad-detail__nav-link"
            onClick={backToResults}
          >
            ‹ Sökresultat
          </button>
          {nextAdId && (
            <button
              type="button"
              className="job-ad-detail__nav-link job-ad-detail__nav-link--next"
              onClick={goNextAd}
            >
              Till nästa platsannons ›
            </button>
          )}
        </div>

        {isLoading && <p className="job-ad-detail__hint">Hämtar annons...</p>}
        {error && (
          <div className="job-ad-detail__error">
            <p>Kunde inte hämta annonsen: {error.message}</p>
            <DigiButton
              afVariation={ButtonVariation.SECONDARY}
              onAfOnClick={() => navigate(-1)}
            >
              Tillbaka
            </DigiButton>
          </div>
        )}

        {!isLoading && !error && ad && (
          <article className="job-ad-detail__card">
            <header className="job-ad-detail__header">
              <h1>{ad.title}</h1>
              {ad.employer && (
                <p className="job-ad-detail__employer">{ad.employer}</p>
              )}
            </header>

            <section>
              <h2>Yrke</h2>
              <p>{ad.occupation}</p>
              <p>
                <strong>Omfattning:</strong> {ad.workingHoursType}
              </p>
              <p>
                <strong>Anställningsform:</strong> {ad.employmentType}
              </p>
              <p>
                <strong>Antal jobb:</strong> {ad.numberOfPositions}
              </p>
            </section>

            <section>
              <h2>Kvalifikationer</h2>
              <p>
                <strong>Arbetslivserfarenhet:</strong>{' '}
                {qualifications.work_experience?.length
                  ? qualifications.work_experience
                      .map((entry) => entry.label || entry)
                      .join(', ')
                  : 'Uppgift saknas'}
              </p>
              <p>
                <strong>Utbildning:</strong>{' '}
                {qualifications.education?.length
                  ? qualifications.education
                      .map((entry) => entry.label || entry)
                      .join(', ')
                  : 'Uppgift saknas'}
              </p>
              <p>
                <strong>Kompetenser:</strong>{' '}
                {qualifications.skills?.length
                  ? qualifications.skills
                      .map((entry) => entry.label || entry)
                      .join(', ')
                  : 'Uppgift saknas'}
              </p>
              <p>
                <strong>Språk:</strong>{' '}
                {qualifications.languages?.length
                  ? qualifications.languages
                      .map((entry) => entry.label || entry)
                      .join(', ')
                  : 'Uppgift saknas'}
              </p>
            </section>

            <section>
              <h2>Om jobbet</h2>
              <p className="job-ad-detail__description">{description || '–'}</p>
            </section>

            <section>
              <h2>Om anställningen</h2>
              <p>
                <strong>Lönetyp:</strong> {salaryType}
              </p>
            </section>

            <section>
              <h2>Var ligger arbetsplatsen?</h2>
              <p>
                {postalCode} {city}
              </p>
              <p>
                <strong>Kommun:</strong> {municipality}
              </p>
            </section>

            <section>
              <h2>Arbetsgivaren</h2>
              <p>{ad.employer}</p>
              {ad.externalUrl && (
                <p>
                  <a
                    className="job-ad-detail__external"
                    href={ad.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Öppna i Platsbanken ↗
                  </a>
                </p>
              )}
            </section>

            {metadata && (
              <section className="job-ad-detail__quality">
                <h2>Datakvalitet</h2>
                <p>
                  <strong>Komplettering:</strong>{' '}
                  {metadata.completeness_score != null
                    ? `${Math.round(metadata.completeness_score)} %`
                    : '–'}
                </p>
                {metadata.missing_fields?.length > 0 && (
                  <p>
                    <strong>Saknade fält:</strong>{' '}
                    {metadata.missing_fields.slice(0, 12).join(', ')}
                    {metadata.missing_fields.length > 12 ? '...' : ''}
                  </p>
                )}
              </section>
            )}
          </article>
        )}
      </div>
    </MainLayout>
  )
}
