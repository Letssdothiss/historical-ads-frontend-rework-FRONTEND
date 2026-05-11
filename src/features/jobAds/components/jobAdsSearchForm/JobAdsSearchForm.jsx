import { useJobAdsSearchParams } from '../../hooks/useJobAdsSearchParams'
import GeographyFilter from './GeographyFilter'
import JobGroupFilter from './JobGroupFilter'
import DrivingLicenseFilter from './DrivingLicenseFilter'

export default function JobAdsSearchForm() {
  const {
    lan,
    kommuner,
    yrkesomraden,
    yrkesgrupper,
    fritext,
    korkort,
    setGeographyFilter,
    setJobFilter,
    setFreetext,
    setDriversLicense,
    clearAll,
  } = useJobAdsSearchParams()

  return (
    <form>
      <GeographyFilter
        initialLan={lan}
        initialKommuner={kommuner}
        onApply={setGeographyFilter}
      />
      <JobGroupFilter
        initialAreas={yrkesomraden}
        initialGroups={yrkesgrupper}
        onApply={setJobFilter}
      />
      <DrivingLicenseFilter
        value={korkort}
        onApply={setDriversLicense}
      />
    </form>
  )
}
