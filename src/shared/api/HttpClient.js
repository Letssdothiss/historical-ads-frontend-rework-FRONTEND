const BASE_URL = 'http://localhost:5000'

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
  const url = `${BASE_URL}${path}${qs ? '?' + qs : ''}`
  console.log('[HttpClient] GET', url)

  const response = await fetch(url)
  if (!response.ok) {
    const text = await response.text()
    console.error('[HttpClient] Fel svar:', response.status, text)
    throw new Error(`HTTP ${response.status}`)
  }

  const json = await response.json()
  console.log('[HttpClient] Svar från', path, json)
  return json
}

export async function getFile(path, params = {}) {
  const qs = buildQuery(params)
  const url = `${BASE_URL}${path}${qs ? '?' + qs : ''}`
  console.log('[HttpClient] GET (fil)', url)

  const response = await fetch(url)
  if (!response.ok) {
    const text = await response.text()
    console.error('[HttpClient] Fel svar:', response.status, text)
    throw new Error(`HTTP ${response.status}`)
  }

  const blob = await response.blob()
  console.log('[HttpClient] Fil mottagen:', blob.type, blob.size, 'bytes')
  return { blob, contentType: blob.type }
}
