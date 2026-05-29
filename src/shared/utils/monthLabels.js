export const SWEDISH_MONTH_NAMES = [
  'Januari',
  'Februari',
  'Mars',
  'April',
  'Maj',
  'Juni',
  'Juli',
  'Augusti',
  'September',
  'Oktober',
  'November',
  'December',
]

const SWEDISH_MONTH_TO_NUMBER = Object.fromEntries(
  SWEDISH_MONTH_NAMES.map((name, index) => [name, index + 1]),
)

/** Accepts Swedish month names or numeric strings (1–12) from URL state. */
export function parseMonthNumbers(months = []) {
  return months
    .map((value) => {
      const asNumber = Number(value)
      if (!Number.isNaN(asNumber) && asNumber >= 1 && asNumber <= 12) {
        return asNumber
      }
      return SWEDISH_MONTH_TO_NUMBER[value] ?? null
    })
    .filter((month) => month != null)
    .sort((a, b) => a - b)
}

/**
 * Human-readable period label combining years with their selected months, e.g.
 * `"Januari 2025"` or `"Januari, Mars 2025 — 2024"`. Months are expected
 * year-qualified (`"2025-01"`); a year with no selected month shows on its own.
 * Used for the statistics summary heading. Returns `''` when nothing is given.
 */
export function formatPeriodLabel(years = [], months = []) {
  const monthsByYear = new Map()
  for (const entry of months) {
    const qualified = /^(\d{4})-(\d{1,2})$/.exec(String(entry))
    if (!qualified) continue
    const month = Number(qualified[2])
    if (month < 1 || month > 12) continue
    const year = qualified[1]
    if (!monthsByYear.has(year)) monthsByYear.set(year, [])
    monthsByYear.get(year).push(month)
  }

  const allYears = [
    ...new Set([...years.map(String), ...monthsByYear.keys()]),
  ].sort()
  if (allYears.length === 0) return ''

  return allYears
    .map((year) => {
      const months = (monthsByYear.get(year) ?? []).sort((a, b) => a - b)
      if (months.length === 0) return year
      const names = months.map((month) => SWEDISH_MONTH_NAMES[month - 1])
      return `${names.join(', ')} ${year}`
    })
    .join(' — ')
}

function monthToNumber(value) {
  const asNumber = Number(value)
  if (!Number.isNaN(asNumber) && asNumber >= 1 && asNumber <= 12) {
    return asNumber
  }
  return SWEDISH_MONTH_TO_NUMBER[value] ?? null
}

/**
 * Build the upstream `published-after` / `published-before` date range from the
 * selected time period.
 *
 * `months` entries are year-qualified (`"2026-01"`) so each month stays tied to
 * its year — that is what lets "Januari 2026" resolve to *only* January 2026
 * instead of a year-wide range. Bare month names/numbers (legacy URLs) are still
 * accepted and applied to every selected year.
 *
 * Upstream takes a single range, so disjoint selections collapse to the tightest
 * range that covers every selected (year, month). A year with no selected month
 * falls back to the whole year. Returns `null` when nothing is selected.
 */
export function buildPublishedDateRange(years = [], months = []) {
  const monthsByYear = new Map()
  const bareMonths = []

  for (const entry of months) {
    const qualified = /^(\d{4})-(\d{1,2})$/.exec(String(entry))
    if (qualified) {
      const month = Number(qualified[2])
      if (month >= 1 && month <= 12) {
        const year = Number(qualified[1])
        if (!monthsByYear.has(year)) monthsByYear.set(year, [])
        monthsByYear.get(year).push(month)
      }
      continue
    }
    const month = monthToNumber(entry)
    if (month != null) bareMonths.push(month)
  }

  const involvedYears = new Set([
    ...years.map(Number).filter(Boolean),
    ...monthsByYear.keys(),
  ])
  if (involvedYears.size === 0) return null

  // Expand the selection into explicit (year, month) periods, then bound them.
  const periods = []
  for (const year of involvedYears) {
    const yearMonths = monthsByYear.get(year)
    const selectedMonths =
      yearMonths && yearMonths.length ? yearMonths : bareMonths
    if (selectedMonths.length) {
      for (const month of selectedMonths) periods.push([year, month])
    } else {
      periods.push([year, 1], [year, 12])
    }
  }

  periods.sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const [minYear, minMonth] = periods[0]
  const [maxYear, maxMonth] = periods[periods.length - 1]

  return {
    after: `${minYear}-${String(minMonth).padStart(2, '0')}-01`,
    before: new Date(Date.UTC(maxYear, maxMonth, 0)).toISOString().slice(0, 10),
  }
}
