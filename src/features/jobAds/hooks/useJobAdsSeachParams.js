import { useSearchParams } from 'react-router-dom'
import { useCallback } from 'react'

/**
 * Sync filterstate with URL-query-parameters.
 *
 * URL-exempel:
 * ?lan=Stockholms+län&lan=Skåne+län&kommun=Stockholm&kommun=Malmö&yrkesomrade=Data%2FIT&yrkesgrupp=Mjukvaru-+och+systemutvecklare+m.fl.&q=javascript&korkort=required
 */
export function useJobAdsSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Read
  const lan          = searchParams.getAll('lan')
  const kommuner     = searchParams.getAll('kommun')
  const yrkesomraden = searchParams.getAll('yrkesomrade')
  const yrkesgrupper = searchParams.getAll('yrkesgrupp')
  const fritext      = searchParams.get('q') ?? ''
  const korkort      = searchParams.get('korkort') ?? ''

  // Write
  const setGeographyFilter = useCallback(({ lan: nyLan, kommuner: nyKommuner }) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      next.delete('lan')
      next.delete('kommun')
      nyLan.forEach(l => next.append('lan', l))
      nyKommuner.forEach(k => next.append('kommun', k))
      return next
    }, { replace: true })
  }, [setSearchParams])

  const setJobFilter = useCallback(({ areas, groups }) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      next.delete('yrkesomrade')
      next.delete('yrkesgrupp')
      areas.forEach(a => next.append('yrkesomrade', a))
      groups.forEach(g => next.append('yrkesgrupp', g))
      return next
    }, { replace: true })
  }, [setSearchParams])

  const setFreetext = useCallback(value => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (value) next.set('q', value)
      else next.delete('q')
      return next
    }, { replace: true })
  }, [setSearchParams])

  const setDriversLicense = useCallback(value => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (value) next.set('korkort', value)
      else next.delete('korkort')
      return next
    }, { replace: true })
  }, [setSearchParams])

  const clearAll = useCallback(() => {
    setSearchParams({}, { replace: true })
  }, [setSearchParams])

  return {
    // State
    lan,
    kommuner,
    yrkesomraden,
    yrkesgrupper,
    fritext,
    korkort,
    // Setters
    setGeographyFilter,
    setJobFilter,
    setFreetext,
    setDriversLicense,
    clearAll,
  }
}
