import { formatShortDate } from '../../../shared/utils/Date'

/**
 * Map a raw hit from the API to a UI-friendly job ad object.
 */
export function mapHitToAd(hit) {
  if (!hit) return null

  // The historical API can return different shapes – handle both flat and nested
  const source = hit._source || hit
  const originalId =
    source.original_id ||
    source.originalId ||
    hit.original_id ||
    hit.originalId ||
    ''

  return {
    id: hit._id || source.id || source.ad_id || '',
    originalId,
    title:
      source.headline ||
      source.title ||
      source.occupation?.label ||
      'Okänd titel',
    employer:
      source.employer?.name || source.employer_name || source.employer || '–',
    occupation:
      source.occupation?.label ||
      source.occupation_group?.label ||
      source.occupation_field?.label ||
      '–',
    municipality:
      source.workplace_address?.municipality ||
      source.municipality?.label ||
      source.municipality ||
      '–',
    region: source.workplace_address?.region || source.region?.label || '–',
    publishedAt: formatShortDate(
      source.publication_date || source.published_at,
    ),
    employmentType: source.employment_type?.label || '–',
    duration: source.duration?.label || '–',
    workingHoursType: source.working_hours_type?.label || '–',
    description: source.description?.text || source.description || '',
    numberOfPositions: source.number_of_vacancies || 1,
    externalUrl: source.webpage_url || source.external_url || null,
    raw: source,
  }
}

/**
 * Map the full search response
 */
export function mapSearchResponse(response) {
  if (!response) return { ads: [], total: 0, offset: 0 }

  const hits = response.hits || []
  const ads = Array.isArray(hits) ? hits.map(mapHitToAd).filter(Boolean) : []

  return {
    ads,
    total: response.result_count ?? response.total ?? ads.length,
    offset: response.offset ?? 0,
  }
}
