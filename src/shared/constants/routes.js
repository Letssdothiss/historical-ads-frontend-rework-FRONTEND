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

/** Prefixes for TabsSwitch tabs, used for scrolling behavior when switching tabs */
export const MAIN_TAB_PREFIXES = [
  ROUTES.JOB_ADS,
  ROUTES.STATISTICS,
  ROUTES.ABOUT,
]

export function getMainTabSection(pathname) {
  for (const prefix of MAIN_TAB_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return prefix
    }
  }
  return null
}

export function buildAdDetailPath(adId) {
  return `/platsannonser/annons/${encodeURIComponent(adId)}`
}
