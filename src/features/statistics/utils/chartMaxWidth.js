/**
 * Width cap (px) that keeps DigiBarChart's x-axis labels visible.
 *
 */
export function chartMaxWidth(categoryCount) {
  if (!categoryCount || categoryCount < 1) return undefined
  return `${categoryCount * 120 + 160}px`
}
