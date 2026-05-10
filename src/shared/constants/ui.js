export const PAGE_SIZE = 25
// The number of page links to show in the pagination control.
export const EMPLOYMENT_TYPES = [
  { value: 'tillsvidare_eller_visstid', label: 'Tillsvidare eller visstid' },
  { value: 'behovsanstallning', label: 'Behovsanställning' },
  { value: 'sommarjobb_feriejobb', label: 'Sommarjobb / feriejobb' },
  { value: 'arbete_utomlands', label: 'Arbete utomlands' },
]
// The number of page links to show in the pagination control.
export const EMPLOYMENT_DURATIONS = [
  { value: 'tillsvidare', label: 'Tillsvidare' },
  { value: '6_manader_eller_mer', label: '6 månader eller längre' },
  { value: '3_6_manader', label: '3 – 6 månader' },
  { value: '11_dagar_3_manader', label: '11 dagar – 3 månader' },
  { value: 'upp_till_10_dagar', label: 'Upp till 10 dagar' },
  { value: 'uppgift_saknas', label: 'Uppgift saknas' },
]
// The number of page links to show in the pagination control.
export const EMPLOYMENT_SCOPES = [
  { value: 'heltid', label: 'Heltid' },
  { value: 'deltid', label: 'Deltid' },
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
