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
