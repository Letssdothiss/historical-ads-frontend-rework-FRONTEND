import { get, getFile } from '../../../shared/api/HttpClient'

export const jobAdsApi = {
  search(params = {}) {
    return get('/search', params)
  },
  getAd(adId, includeMetadata = true) {
    return get(`/search/ad/${adId}`, { include_metadata: includeMetadata })
  },
  getFilters(params = {}) {
    return get('/filters', params)
  },
  getFilter(name, params = {}) {
    return get(`/filters/${name}`, params)
  },
  shareUrl(params = {}) {
    return get('/share-url', params)
  },
  export(params = {}, format = 'json') {
    return getFile('/export', { ...params, format })
  },
}
