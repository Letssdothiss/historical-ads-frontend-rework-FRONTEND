import { http, HttpResponse } from 'msw'

/** Must match HttpClient default (see src/shared/api/HttpClient.js). */
export const API_BASE = 'http://localhost:5000/api/v1'

const defaultSearchResponse = {
  hits: [
    {
      _id: 'ad-integration-1',
      _source: {
        headline: 'Integration testannons',
        employer: { name: 'Test AB' },
        workplace_address: {
          municipality: 'Växjö',
          region: 'Kronobergs län',
        },
      },
    },
  ],
  result_count: 1,
  offset: 0,
}

const defaultStatsResponse = {
  stats: {
    region: [{ label: 'Stockholms län', occurrences: 42 }],
  },
}

export const handlers = [
  http.get(`${API_BASE}/search`, () =>
    HttpResponse.json(defaultSearchResponse),
  ),
  http.get(`${API_BASE}/stats`, () => HttpResponse.json(defaultStatsResponse)),
]

export function emptySearchResponse() {
  return HttpResponse.json({ hits: [], result_count: 0, offset: 0 })
}

export function searchErrorResponse(message = 'Serverfel') {
  return HttpResponse.json({ message }, { status: 500 })
}

export function statsErrorResponse(message = 'Statistikfel') {
  return HttpResponse.json({ message }, { status: 500 })
}
