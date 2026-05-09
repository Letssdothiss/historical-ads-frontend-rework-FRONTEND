/**
 * Formats the total count of job ads for display.
 * @param {number} total - The total number of job ads.
 * @returns {string} The formatted string showing the total count.
 */
export function formatResultCount(total) {
  if (total === undefined || total === null) return ''
  return `${total.toLocaleString('sv-SE')} annonser`
}