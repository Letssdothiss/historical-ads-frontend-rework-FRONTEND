/**
 * Build URLSearchParams from an object, skipping null/undefined/empty values.
 * Arrays are serialized as repeated keys.
 */
export function buildQueryString(params = {}) {
  const qs = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === '') continue
    if (Array.isArray(value)) {
      value.forEach((v) => v !== '' && qs.append(key, v))
    } else {
      qs.append(key, String(value))
    }
  }
  return qs.toString()
}
