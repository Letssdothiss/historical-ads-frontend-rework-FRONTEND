import { beforeEach, describe, expect, it, vi } from 'vitest'

const { axiosGet, interceptor } = vi.hoisted(() => ({
  axiosGet: vi.fn(),
  interceptor: { onSuccess: null, onError: null },
}))

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: (url, config) =>
        axiosGet(url, config).then(
          (response) => interceptor.onSuccess(response),
          (error) => interceptor.onError(error),
        ),
      interceptors: {
        response: {
          use: (onSuccess, onError) => {
            interceptor.onSuccess = onSuccess
            interceptor.onError = onError
          },
        },
      },
    })),
  },
}))

import { get, getFile } from '../../api/HttpClient'

describe('HttpClient', () => {
  beforeEach(() => {
    axiosGet.mockReset()
    axiosGet.mockImplementation((_url, config) =>
      Promise.resolve({
        data:
          config?.responseType === 'blob'
            ? new Blob(['export'], { type: 'text/csv' })
            : { ok: true },
      }),
    )
  })

  describe('get', () => {
    it('requests path without query when params are empty', async () => {
      const result = await get('/search')

      expect(axiosGet).toHaveBeenCalledWith('/search', undefined)
      expect(result).toEqual({ ok: true })
    })

    it('builds query string from scalar and array params', async () => {
      await get('/search', {
        q: 'react',
        lan: ['Stockholms län', 'Skåne län'],
        offset: 0,
      })

      expect(axiosGet).toHaveBeenCalledWith(
        '/search?q=react&lan=Stockholms+l%C3%A4n&lan=Sk%C3%A5ne+l%C3%A4n&offset=0',
        undefined,
      )
    })

    it('omits empty, null, and undefined param values', async () => {
      await get('/filters', {
        q: '',
        lan: ['', null, 'Skåne län'],
        unused: undefined,
      })

      const [url] = axiosGet.mock.calls[0]
      expect(url).toBe('/filters?lan=Sk%C3%A5ne+l%C3%A4n')
    })

    it('rejects with API error message from response body', async () => {
      axiosGet.mockRejectedValueOnce({
        response: { data: { message: 'Ogiltig förfrågan' } },
        message: 'Request failed',
      })

      await expect(get('/search')).rejects.toThrow('Ogiltig förfrågan')
    })

    it('falls back to generic Swedish message when error has no body', async () => {
      axiosGet.mockRejectedValueOnce({ message: 'Network Error' })

      await expect(get('/search')).rejects.toThrow('Network Error')
    })
  })

  describe('getFile', () => {
    it('returns blob and content type for file downloads', async () => {
      const result = await getFile('/export', { format: 'csv' })

      expect(axiosGet).toHaveBeenCalledWith('/export?format=csv', {
        responseType: 'blob',
      })
      expect(result.blob).toBeInstanceOf(Blob)
      expect(result.contentType).toBe('text/csv')
    })
  })
})
