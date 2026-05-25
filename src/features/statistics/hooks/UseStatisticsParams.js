import { useSearchParams } from 'react-router-dom'

export function useStatisticsParams() {
  const [searchParams, setSearchParams] = useSearchParams()

  const params = {
    lan: searchParams.getAll('lan'),
    ar: searchParams.getAll('ar'),
    yrkesgrupp: searchParams.getAll('yrkesgrupp'),
    kompetens: searchParams.get('kompetens') ?? '',
  }

  const setParams = (newParams) => {
    const next = new URLSearchParams()
    for (const [key, val] of Object.entries(newParams)) {
      if (Array.isArray(val)) {
        val.forEach((v) => next.append(key, v))
      } else if (val) {
        next.set(key, val)
      }
    }
    setSearchParams(next)
  }

  const hasParams =
    params.lan.length > 0 ||
    params.ar.length > 0 ||
    params.yrkesgrupp.length > 0 ||
    params.kompetens

  return { params, setParams, hasParams }
}
