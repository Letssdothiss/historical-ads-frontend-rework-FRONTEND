import axios from 'axios'

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api/v1'

const httpClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

httpClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Ett okänt fel inträffade'
    return Promise.reject(new Error(message))
  },
)

function buildQuery(params) {
  const query = new URLSearchParams()
  for (const [key, val] of Object.entries(params)) {
    if (Array.isArray(val)) {
      val.forEach((v) => v !== '' && v != null && query.append(key, String(v)))
    } else if (val !== undefined && val !== null && val !== '') {
      query.set(key, String(val))
    }
  }
  return query.toString()
}

export async function get(path, params = {}) {
  const qs = buildQuery(params)
  return httpClient.get(`${path}${qs ? '?' + qs : ''}`)
}

export async function getFile(path, params = {}) {
  const qs = buildQuery(params)
  const blob = await httpClient.get(`${path}${qs ? '?' + qs : ''}`, {
    responseType: 'blob',
  })
  return { blob, contentType: blob.type }
}

export default httpClient
