import { Navigate, Route, Routes } from 'react-router-dom'
import { ROUTES } from '../shared/constants/routes'
import JobAdsSearchPage from '../pages/jobAdsSearchPage/JobAdsSearchPage'
import JobAdsResultsPage from '../pages/jobAdsResultsPage/JobAdsResultsPage'
import JobAdDetailPage from '../pages/jobAdDetailPage/JobAdDetailPage'
import StatisticsSearchPage from '../pages/statisticsSearchPage/StatisticsSearchPage'
import StatisticsResultsPage from '../pages/statisticsResultsPage/StatisticsResultsPage'
import AboutDataPage from '../pages/aboutDataPage/AboutDataPage'
import NotFoundPage from '../pages/notFoundPage/NotFoundPage'

function AppRoutes() {
  return (
    <Routes>
      <Route
        path={ROUTES.HOME}
        element={<Navigate to={ROUTES.JOB_ADS} replace />}
      />
      <Route path={ROUTES.JOB_ADS} element={<JobAdsSearchPage />} />
      <Route path={ROUTES.JOB_ADS_RESULTS} element={<JobAdsResultsPage />} />
      <Route path={ROUTES.JOB_AD_DETAIL} element={<JobAdDetailPage />} />
      <Route path={ROUTES.STATISTICS} element={<StatisticsSearchPage />} />
      <Route
        path={ROUTES.STATISTICS_RESULTS}
        element={<StatisticsResultsPage />}
      />
      <Route path={ROUTES.ABOUT} element={<AboutDataPage />} />
      <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRoutes
