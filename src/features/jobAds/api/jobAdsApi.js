import httpClient from '../../../shared/api/httpClient'
import { buildQueryString } from '../../../shared/utils/queryString'
// API client for job ads related endpoints
export const jobAdsApi = {
  search(params) {
    const qs = buildQueryString(params)
    return httpClient.get(`/search?${qs}`)
  },
  // Fetch a single ad by ID, with optional metadata
  getAd(adId, includeMetadata = true) {
    return httpClient.get(
      `/search/ad/${adId}?include_metadata=${includeMetadata}`,
    )
  },
  // Fetch available filter options based on current search parameters
  getFilters(params = {}) {
    const qs = buildQueryString(params)
    return httpClient.get(`/filters?${qs}`)
  },
  // Export search results as a file (e.g., CSV or Excel) based on current parameters
  export(params = {}, format = 'json') {
    const qs = buildQueryString({ ...params, format })
    // Request as blob so frontend can trigger file download
    return httpClient.get(`/export?${qs}`, { responseType: 'blob' })
  },
  // Generate a shareable URL for the current search parameters
  shareUrl(params = {}) {
    const qs = buildQueryString(params)
    return httpClient.get(`/share-url?${qs}`)
  },
}
