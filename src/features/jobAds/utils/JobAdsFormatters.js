/**
 * Formats the total count of job ads for display.
 * @param {number} total - The total number of job ads.
 * @returns {string} The formatted string showing the total count.
 */
export function formatResultCount(total) {
  if (total === undefined || total === null) return ''
  return `${total.toLocaleString('sv-SE')} annonser`
}
/**
 * Formats the label for employer search based on its type.
 * @param {string} type - The type of the employer search.
 * @returns {string} The formatted label for the employer search.
 */
export function formatEmployerSearchLabel(type) {
  return type === 'org_number' ? 'Organisationsnummer' : 'Namn'
}
