import { useState } from 'react'
import './HomePage.css';
import MainLayout from '../../app/layout/MainLayout';
import ContentWrapper from '../../shared/components/contentWrapper/ContentWrapper';
import StatisticsSearchForm from '../../features/statistics/components/statisticsSearchForm/StatisticsSearchForm'
import StatisticsChartPanel from '../../features/statistics/components/statisticsChartPanel/StatisticsChartPanel';
import { useStatisticsQuery } from '../../features/statistics/hooks/UseStatisticsQuery'

function HomePage() {
  const [searchParams, setSearchParams] = useState(null)
  const { data, loading, error } = useStatisticsQuery(searchParams)

  const handleSearch = (params) => {
    console.log('[HomePage] Ny sökning:', params)
    setSearchParams(params)
  }

  return (
    <div className="home-page">
      <MainLayout>
        <ContentWrapper />
        <StatisticsSearchForm onSearch={handleSearch} />
        {loading && <p>Laddar statistik...</p>}
        {error && <p>Fel: {error.message}</p>}
        <StatisticsChartPanel
          data={data ?? undefined}
          searchParams={searchParams ?? {}}
        />
      </MainLayout>
    </div>
  );
}

export default HomePage;