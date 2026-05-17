import MainLayout from '../../app/layout/MainLayout'
import ContentWrapper from '../../shared/components/contentWrapper/ContentWrapper'
import StatisticsSearchForm from '../../features/statistics/components/statisticsSearchForm/StatisticsSearchForm'

export default function StatisticsSearchPage() {
  return (
    <MainLayout>
      <ContentWrapper>
        <StatisticsSearchForm />
      </ContentWrapper>
    </MainLayout>
  )
}
