import { useEffect, useMemo, useState } from 'react'
import { jobAdsApi } from '../api/jobAdsApi'
import { mapSearchResponse } from '../api/jobAdsMapper'
import { PAGE_SIZE } from '../../../shared/constants/ui'
import { resolveEmploymentTypeParams } from '../../../shared/utils/employmentParams'
import { parseMonthNumbers } from '../../../shared/utils/monthLabels'

// this hook is used for both the search page and the employer's job ads page, so it needs to be flexible in how it maps UI params to API params

function toApiParams(uiParams = {}, { offset = 0, limit = PAGE_SIZE } = {}) {
  const api = { offset, limit }
  if (uiParams.q) api.q = uiParams.q
  if (uiParams.employer) api.employer = uiParams.employer
  if (uiParams.organization_number)
    api.organization_number = uiParams.organization_number
  if (uiParams.skills?.length) api.skills = uiParams.skills
  if (uiParams.kommuner?.length) api.municipality = uiParams.kommuner
  if (uiParams.yrkesgrupper?.length)
    api.occupation_group = uiParams.yrkesgrupper
  if (uiParams.employment_type?.length) {
    const { conceptIds, abroad } = resolveEmploymentTypeParams(
      uiParams.employment_type,
    )
    if (conceptIds.length) api.employment_type = conceptIds
    if (abroad) api.abroad = true
  }
  if (uiParams.duration?.length) api.duration = uiParams.duration
  // Upstream's worktime filter is `worktime-extent`, not `working-hours-type`
  // (that name is ignored and returns unfiltered results).
  if (uiParams.working_hours_type?.length)
    api.worktime_extent = uiParams.working_hours_type
  if (uiParams.years?.length || uiParams.months?.length) {
    const years = (uiParams.years || []).map(Number).filter(Boolean).sort()
    const months = parseMonthNumbers(uiParams.months)
    if (years.length) {
      const minYear = years[0]
      const maxYear = years[years.length - 1]
      const minMonth = months.length ? months[0] : 1
      const maxMonth = months.length ? months[months.length - 1] : 12
      api.published_after = `${minYear}-${String(minMonth).padStart(2, '0')}-01`
      const endDate = new Date(Date.UTC(maxYear, maxMonth, 0))
      api.published_before = endDate.toISOString().slice(0, 10)
    }
  }
  if (uiParams.korkort === 'required') api.driving_license_required = true
  if (uiParams.korkort === 'not_required') api.driving_license_required = false
  return api
}

const EMPTY_RESULT = { ads: [], total: 0, offset: 0 }

// the hook returns the data in a format that is easy to use in the UI, and also includes loading and error states
export function useJobAdsQuery(
  uiParams,
  { page = 1, pageSize = PAGE_SIZE, enabled = true } = {},
) {
  const [data, setData] = useState(EMPTY_RESULT)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  const apiParams = useMemo(
    () =>
      toApiParams(uiParams, {
        offset: (page - 1) * pageSize,
        limit: pageSize,
      }),
    [uiParams, page, pageSize],
  )

  const requestKey = useMemo(
    () => JSON.stringify({ apiParams, enabled, reloadKey }),
    [apiParams, enabled, reloadKey],
  )

  useEffect(() => {
    if (!enabled) return undefined

    let cancelled = false

    void (async () => {
      setIsLoading(true)
      setIsError(false)
      setError(null)

      try {
        const res = await jobAdsApi.search(apiParams)
        if (cancelled) return
        setData(mapSearchResponse(res))
      } catch (err) {
        if (cancelled) return
        setIsError(true)
        setError(err)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [apiParams, enabled, requestKey])

  const refetch = () => setReloadKey((k) => k + 1)

  return { ...data, isLoading, isError, error, refetch }
}
