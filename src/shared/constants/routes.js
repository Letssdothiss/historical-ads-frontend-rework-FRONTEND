export const ROUTES = {
  HOME: '/',
  JOB_ADS: '/platsannonser',
  JOB_ADS_RESULTS: '/platsannonser/resultat',
  JOB_AD_DETAIL: '/platsannonser/annons/:adId',
  STATISTICS: '/statistik',
  STATISTICS_RESULTS: '/statistik/resultat',
  ABOUT: '/om-datan',
  NOT_FOUND: '*',
}

export function buildAdDetailPath(adId) {
  return `/platsannonser/annons/${encodeURIComponent(adId)}`
}
