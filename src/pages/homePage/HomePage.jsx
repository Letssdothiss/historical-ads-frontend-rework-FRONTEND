import './HomePage.css'
import MainLayout from '../../app/layout/MainLayout'
import ContentWrapper from '../../shared/components/contentWrapper/ContentWrapper'
import JobAdsSearchForm from '../../features/jobAds/components/jobAdsSearchForm/JobAdsSearchForm'

function HomePage() {
  return (
    <div className="home-page">
      <MainLayout>
        <ContentWrapper>
          <JobAdsSearchForm />
        </ContentWrapper>
      </MainLayout>
    </div>
  )
}

export default HomePage
