import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BASE_URL ?? 'http://localhost:5000'

// Create an instance of axios with default configuration
const httpClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add a response interceptor to handle responses and errors.
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
      val.forEach(v => query.append(key, String(v)))
    } else if (val !== undefined && val !== null && val !== '') {
      query.set(key, String(val))
    }
  }
  return query.toString()
}

export async function get(path, params = {}) {
  const qs = buildQuery(params)
  const url = `${path}${qs ? '?' + qs : ''}`
  console.log('[HttpClient] GET', BASE_URL + url)
  const data = await httpClient.get(url)
  console.log('[HttpClient] Svar från', path, data)
  return data
}

export async function getFile(path, params = {}) {
  const qs = buildQuery(params)
  const url = `${path}${qs ? '?' + qs : ''}`
  console.log('[HttpClient] GET (fil)', BASE_URL + url)
  const blob = await httpClient.get(url, { responseType: 'blob' })
  console.log('[HttpClient] Fil mottagen:', blob.type, blob.size, 'bytes')
  return { blob, contentType: blob.type }
}

export default httpClient
