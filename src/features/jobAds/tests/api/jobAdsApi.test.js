import { beforeEach, describe, expect, it, vi } from 'vitest'
import { jobAdsApi } from '../../api/jobAdsApi'

const getMock = vi.fn()
const getFileMock = vi.fn()

vi.mock('../../../../shared/api/HttpClient', () => ({
  default: {},
  get: (...args) => getMock(...args),
  getFile: (...args) => getFileMock(...args),
}))

describe('jobAdsApi', () => {
  beforeEach(() => {
    getMock.mockReset()
    getFileMock.mockReset()
  })

  it('search calls GET /search with params', async () => {
    getMock.mockResolvedValue({ hits: [] })
    const params = { q: 'react', lan: ['Stockholm'] }

    await jobAdsApi.search(params)

    expect(getMock).toHaveBeenCalledWith('/search', params)
  })

  it('search uses empty params by default', async () => {
    getMock.mockResolvedValue({ hits: [] })

    await jobAdsApi.search()

    expect(getMock).toHaveBeenCalledWith('/search', {})
  })

  it('getAd calls GET /search/ad/:id with metadata flag', async () => {
    getMock.mockResolvedValue({})

    await jobAdsApi.getAd('abc-123', false)

    expect(getMock).toHaveBeenCalledWith('/search/ad/abc-123', {
      include_metadata: false,
    })
  })

  it('getAd includes metadata by default', async () => {
    getMock.mockResolvedValue({})

    await jobAdsApi.getAd('abc-123')

    expect(getMock).toHaveBeenCalledWith('/search/ad/abc-123', {
      include_metadata: true,
    })
  })

  it('getFilters calls GET /filters with params', async () => {
    getMock.mockResolvedValue({})
    const params = { lan: ['Skåne län'] }

    await jobAdsApi.getFilters(params)

    expect(getMock).toHaveBeenCalledWith('/filters', params)
  })

  it('getFilter calls GET /filters/:name with params', async () => {
    getMock.mockResolvedValue({})

    await jobAdsApi.getFilter('kommun', { lan: 'Skåne län' })

    expect(getMock).toHaveBeenCalledWith('/filters/kommun', { lan: 'Skåne län' })
  })

  it('shareUrl calls GET /share-url with params', async () => {
    getMock.mockResolvedValue({ url: 'https://example.com/share' })

    await jobAdsApi.shareUrl({ q: 'react' })

    expect(getMock).toHaveBeenCalledWith('/share-url', { q: 'react' })
  })

  it('export calls getFile with format in params', async () => {
    getFileMock.mockResolvedValue({ blob: new Blob(), contentType: 'application/json' })

    await jobAdsApi.export({ q: 'test' }, 'csv')

    expect(getFileMock).toHaveBeenCalledWith('/export', { q: 'test', format: 'csv' })
  })

  it('export defaults to json format', async () => {
    getFileMock.mockResolvedValue({ blob: new Blob(), contentType: 'application/json' })

    await jobAdsApi.export({ q: 'test' })

    expect(getFileMock).toHaveBeenCalledWith('/export', { q: 'test', format: 'json' })
  })
})
