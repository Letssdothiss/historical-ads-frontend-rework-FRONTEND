import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import MainLayout from '../../app/layout/MainLayout'
import { fetchStatistics } from '../../features/statistics/api/StatisticsApi'
import { mapStatisticsResponse } from '../../features/statistics/api/StatisticsMapper'
import StatisticsChartPanel from '../../features/statistics/components/statisticsChartPanel/StatisticsChartPanel'
import StatisticsSearchForm from '../../features/statistics/components/statisticsSearchForm/StatisticsSearchForm'
import ContentWrapper from '../../shared/components/contentWrapper/ContentWrapper'
import ResultsAdjustSearch from '../../shared/components/resultsAdjustSearch/ResultsAdjustSearch'
import './StatisticsResultsPage.css'

function readUiParamsFromUrl(searchParams) {
  return {
    q: searchParams.get('q') ?? '',
    kompetens: searchParams.get('q') ?? '',
    ar: searchParams.getAll('years'),
    lan: searchParams.getAll('lan'),
    municipality: searchParams.getAll('kommun'),
    occupation_field: searchParams.getAll('yrkesomrade'),
    occupation_group: searchParams.getAll('yrkesgrupp'),
    skills: searchParams.getAll('skills'),
    driving_license_required: searchParams.get('korkort'),
    trend: searchParams.get('trend') ?? '',
  }
}

export default function StatisticsResultsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const params = readUiParamsFromUrl(searchParams)

  const [data, setData] = useState([])
  const [yearResults, setYearResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [adjustOpen, setAdjustOpen] = useState(false)

  useEffect(() => {
    let alive = true
    setIsLoading(true)
    setError(null)
    fetchStatistics(params)
      .then((results) => {
        if (!alive) return
        setYearResults(results)
        setData(mapStatisticsResponse(results))
      })
      .catch((err) => alive && setError(err))
      .finally(() => alive && setIsLoading(false))
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  return (
    <MainLayout>
      <ContentWrapper>
        <ResultsAdjustSearch
          open={adjustOpen}
          onToggle={() => setAdjustOpen((open) => !open)}
        >
          <StatisticsSearchForm />
        </ResultsAdjustSearch>
      </ContentWrapper>

      <div className="statistics-results">
        {isLoading && (
          <p className="statistics-results__hint">Hämtar statistik...</p>
        )}
        {error && (
          <div className="statistics-results__error">
            <p>Kunde inte hämta statistik: {error.message}</p>
            <button type="button" onClick={() => navigate('/statistik')}>
              Tillbaka
            </button>
          </div>
        )}
        {!isLoading && !error && (
          <StatisticsChartPanel
            data={data}
            yearResults={yearResults}
            searchParams={{
              kompetens: params.q,
              lan: params.lan,
              ar: params.ar,
            }}
          />
        )}
      </div>
    </MainLayout>
  )
}
