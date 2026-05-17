import MainLayout from '../../app/layout/MainLayout'
import ContentWrapper from '../../shared/components/contentWrapper/ContentWrapper'
import JobAdsSearchForm from '../../features/jobAds/components/jobAdsSearchForm/JobAdsSearchForm'

export default function JobAdsSearchPage() {
  return (
    <MainLayout>
      <ContentWrapper>
        <JobAdsSearchForm />
      </ContentWrapper>
    </MainLayout>
  )
}
