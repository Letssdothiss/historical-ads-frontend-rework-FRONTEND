/**
 * Translate "Typ av anställning" picker values into upstream API params.
 *
 * Most picker option values are a single JobTech taxonomy concept-id, but two
 * are special (see EMPLOYMENT_TYPES in shared/constants/ui):
 *  - "Tillsvidare eller visstid" is a comma-joined pair of concept-ids that
 *    should match either type (the upstream API ORs repeated employment-type).
 *  - "Arbete utomlands" is the sentinel `abroad`, which upstream models as a
 *    separate `abroad=true` flag rather than an employment-type.
 *
 * Returns the concept-ids to send as `employment_type` plus whether the
 * `abroad` flag should be set.
 */
export function resolveEmploymentTypeParams(values = []) {
  const conceptIds = []
  let abroad = false
  for (const value of values) {
    if (value === 'abroad') {
      abroad = true
      continue
    }
    value
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean)
      .forEach((id) => conceptIds.push(id))
  }
  return { conceptIds, abroad }
}
