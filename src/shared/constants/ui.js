export const PAGE_SIZE = 25
// "Fakta anställning" filter options. The `value`s are JobTech taxonomy
// concept-ids — the historical API filters on these (slugs are ignored
// upstream and silently return unfiltered results). The ids below were
// verified against the live dataset at historical.api.jobtechdev.se.
//
// Two type options don't map 1:1 to a single concept-id and are resolved in
// resolveEmploymentTypeParams (shared/utils/employmentParams): a comma-joined
// pair filters on either id (OR), and the `abroad` sentinel becomes the
// separate upstream `abroad=true` flag rather than an employment-type.
export const EMPLOYMENT_TYPES = [
  { value: 'kpPX_CNN_gDU,sTu5_NBQ_udq', label: 'Tillsvidare eller visstid' },
  { value: '1paU_aCR_nGn', label: 'Behovsanställning' },
  { value: 'Jh8f_q9J_pbJ', label: 'Sommarjobb / feriejobb' },
  { value: 'abroad', label: 'Arbete utomlands' },
]
// Sent upstream as `duration=<concept-id>`.
export const EMPLOYMENT_DURATIONS = [
  { value: 'a7uU_j21_mkL', label: 'Tillsvidare' },
  { value: 'qQUd_4qe_NDT', label: '6 månader eller längre' },
  { value: 'Xj7x_7yZ_jEn', label: '3 – 6 månader' },
  { value: 'Sy9J_aRd_ALx', label: '11 dagar – 3 månader' },
  { value: 'cAQ8_TpB_Tdv', label: 'Upp till 10 dagar' },
]
// Sent upstream as `worktime-extent=<concept-id>`.
export const EMPLOYMENT_SCOPES = [
  { value: '6YE1_gAC_R2G', label: 'Heltid' },
  { value: '947z_JGS_Uk2', label: 'Deltid' },
]
// The number of page links to show in the pagination control.
export const TRENDS = [
  { value: 'top5_occupations', label: '5 vanligaste yrkesgrupperna' },
  { value: 'top5_skills', label: '5 vanligste kompetenserna' },
  { value: 'top5_growing', label: '5 yrkesgrupper – ökat mest' },
  { value: 'top5_declining', label: '5 yrkesgrupper – minskat mest' },
]
// The number of page links to show in the pagination control.
export const DRIVING_LICENSE = [
  { value: 'required', label: 'Körkort efterfrågas' },
  { value: 'not_required', label: 'Körkort efterfrågas inte' },
]
// Mock job ads data for content wrapper
export const TABS = {
  JOB_ADS: 'platsannonser',
  STATISTICS: 'statistik',
  ABOUT: 'om_datan',
}
