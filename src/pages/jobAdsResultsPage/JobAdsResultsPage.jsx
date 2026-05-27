import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import MainLayout from '../../app/layout/MainLayout'
import ContentWrapper from '../../shared/components/contentWrapper/ContentWrapper'
import ResultsAdjustSearch from '../../shared/components/resultsAdjustSearch/ResultsAdjustSearch'
import JobAdsSearchForm from '../../features/jobAds/components/jobAdsSearchForm/JobAdsSearchForm'
import JobAdsResultsList from '../../features/jobAds/components/jobAdsResultsList/JobAdsResultsList'
import JobAdsPagination from '../../features/jobAds/components/jobAdsPagination/JobAdsPagination'
import { useJobAdsQuery } from '../../features/jobAds/hooks/useJobAdsQuery'
import { PAGE_SIZE } from '../../shared/constants/ui'
import { buildAdDetailPath } from '../../shared/constants/routes'
import './JobAdsResultsPage.css'

function readUiParamsFromUrl(searchParams) {
  const yrkesgruppLabels = searchParams.get('yrkesgrupp-labels')
  const kommunLabels = searchParams.get('kommun-labels')
  return {
    q: searchParams.get('q') ?? '',
    lan: searchParams.getAll('lan'),
    kommuner: searchParams.getAll('kommun'),
    kommunGrouped: kommunLabels ? JSON.parse(kommunLabels) : {},
    yrkesomraden: searchParams.getAll('yrkesomrade'),
    yrkesgrupper: searchParams.getAll('yrkesgrupp'),
    yrkesgruppGrouped: yrkesgruppLabels ? JSON.parse(yrkesgruppLabels) : {},
    years: searchParams.getAll('years'),
    months: searchParams.getAll('months'),
    employer: searchParams.get('employer') ?? '',
    organization_number: searchParams.get('organization_number') ?? '',
    skills: searchParams.getAll('skills'),
    korkort: searchParams.get('korkort') ?? '',
  }
}

function buildSummary(params) {
  const parts = []
  if (params.q) parts.push(`"${params.q}"`)
  if (params.kommunGrouped && Object.keys(params.kommunGrouped).length) {
    const labels = Object.values(params.kommunGrouped).flat()
    parts.push(labels.join(', '))
  } else if (params.kommuner.length) {
    parts.push(params.kommuner.join(', '))
  }
  if (
    params.yrkesgruppGrouped &&
    Object.keys(params.yrkesgruppGrouped).length
  ) {
    const labels = Object.values(params.yrkesgruppGrouped).flat()
    parts.push(labels.join(', '))
  } else if (params.yrkesgrupper.length) {
    parts.push(params.yrkesgrupper.join(', '))
  }
  if (params.years.length) parts.push(params.years.sort().join(', '))
  if (params.employer) parts.push(`Arbetsgivare: ${params.employer}`)
  if (params.skills.length)
    parts.push(`Kompetenser: ${params.skills.join(', ')}`)
  return parts.length ? parts.join(' — ') : 'Alla annonser'
}

export default function JobAdsResultsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const uiParams = useMemo(
    () => readUiParamsFromUrl(searchParams),
    [searchParams],
  )

  const [page, setPage] = useState(1)
  const [adjustOpen, setAdjustOpen] = useState(false)

  const { ads, total, isLoading, isError, error, refetch } = useJobAdsQuery(
    uiParams,
    { page, pageSize: PAGE_SIZE },
  )

  const totalPages = total ? Math.ceil(total / PAGE_SIZE) : 0
  const summary = buildSummary(uiParams)

  const handleViewAd = (ad) => {
    if (!ad?.id) return
    try {
      const ids = (ads || []).map((entry) => entry.id).filter(Boolean)
      sessionStorage.setItem(
        'jobAds:lastResultIds',
        JSON.stringify({ ids, query: searchParams.toString() }),
      )
    } catch {
      /* sessionStorage unavailable — non-fatal */
    }
    navigate(buildAdDetailPath(ad.id))
  }

  return (
    <MainLayout>
      <ContentWrapper>
        <ResultsAdjustSearch
          open={adjustOpen}
          onToggle={() => setAdjustOpen((open) => !open)}
        >
          <JobAdsSearchForm />
        </ResultsAdjustSearch>
      </ContentWrapper>

      <div className="results-body">
        <div className="results-summary">
          <p className="results-summary__criteria">{summary}</p>
          <p className="results-count">
            {total
              ? `${total} annonser`
              : isLoading
                ? 'Söker...'
                : '0 annonser'}{' '}
            {uiParams.years.length ? (
              <span>
                under perioden <em>{uiParams.years.sort().join(', ')}</em>
              </span>
            ) : null}
          </p>
        </div>

        <JobAdsResultsList
          ads={ads}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onViewAd={handleViewAd}
          onRetry={refetch}
        />

        {totalPages > 1 && (
          <JobAdsPagination
            currentPage={page}
            totalPages={totalPages}
            totalResults={total}
            pageSize={PAGE_SIZE}
            onPageChange={(detail) => {
              const next = detail?.afNextPage ?? detail?.page ?? page
              setPage(next)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        )}
      </div>
    </MainLayout>
  )
}
