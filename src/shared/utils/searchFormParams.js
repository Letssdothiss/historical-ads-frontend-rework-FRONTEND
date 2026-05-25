function parseJsonLabelsParam(searchParams, key) {
  const raw = searchParams.get(key)
  if (!raw) return {}
  try {
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

const EMPTY_GEOGRAPHY = { lan: [], kommuner: [], grouped: {} }
const EMPTY_OCCUPATIONS = { areas: [], groups: [], grouped: {} }
const EMPTY_TIME_PERIOD = { years: [], months: [] }
const EMPTY_EMPLOYMENT = { type: [], duration: [], scope: [] }

/** Form state for JobAdsSearchForm / results URL on /platsannonser/resultat */
export function parseJobAdsSearchFormState(searchParams) {
  const kommunGrouped = parseJsonLabelsParam(searchParams, 'kommun-labels')
  const yrkesgruppGrouped = parseJsonLabelsParam(searchParams, 'yrkesgrupp-labels')
  const lanFromUrl = searchParams.getAll('lan')
  const organizationNumber = searchParams.get('organization_number') ?? ''

  return {
    q: searchParams.get('q') ?? '',
    geography: {
      lan: lanFromUrl.length > 0 ? lanFromUrl : Object.keys(kommunGrouped),
      kommuner: searchParams.getAll('kommun'),
      grouped: kommunGrouped,
    },
    occupations: {
      areas: searchParams.getAll('yrkesomrade'),
      groups: searchParams.getAll('yrkesgrupp'),
      grouped: yrkesgruppGrouped,
    },
    timePeriod: {
      years: searchParams.getAll('years'),
      months: searchParams.getAll('months'),
    },
    employment: {
      type: searchParams.getAll('employment_type'),
      duration: searchParams.getAll('duration'),
      scope: searchParams.getAll('working_hours_type'),
    },
    employerType: organizationNumber ? 'org' : 'name',
    employer: searchParams.get('employer') ?? '',
    organizationNumber,
    skills: searchParams.getAll('skills').join(', '),
  }
}

/** Form state for StatisticsSearchForm / results URL on /statistik/resultat */
export function parseStatisticsSearchFormState(searchParams) {
  const kommunGrouped = parseJsonLabelsParam(searchParams, 'kommun-labels')
  const yrkesgruppGrouped = parseJsonLabelsParam(searchParams, 'yrkesgrupp-labels')
  const lanFromUrl = searchParams.getAll('lan')

  return {
    q: searchParams.get('q') ?? '',
    trend: searchParams.get('trend') ?? '',
    drivingLicense: searchParams.get('korkort') ?? '',
    geography: {
      lan: lanFromUrl.length > 0 ? lanFromUrl : Object.keys(kommunGrouped),
      kommuner: searchParams.getAll('kommun'),
      grouped: kommunGrouped,
    },
    occupations: {
      areas: searchParams.getAll('yrkesomrade'),
      groups: searchParams.getAll('yrkesgrupp'),
      grouped: yrkesgruppGrouped,
    },
    timePeriod: {
      years: searchParams.getAll('years'),
      months: searchParams.getAll('months'),
    },
    employment: {
      type: searchParams.getAll('employment_type'),
      duration: searchParams.getAll('duration'),
      scope: searchParams.getAll('working_hours_type'),
    },
    skills: searchParams.getAll('skills').join(', '),
  }
}

/** Stable remount key when geography selection changes (avoids prop→state sync in filters). */
export function geographyFilterKey({ lan = [], kommuner = [] } = {}) {
  return `${[...lan].sort().join('|')}#${[...kommuner].sort().join('|')}`
}

/** Stable remount key when job group selection changes. */
export function jobGroupFilterKey({ areas = [], groups = [] } = {}) {
  return `${[...areas].sort().join('|')}#${[...groups].sort().join('|')}`
}

export {
  EMPTY_EMPLOYMENT,
  EMPTY_GEOGRAPHY,
  EMPTY_OCCUPATIONS,
  EMPTY_TIME_PERIOD,
}
