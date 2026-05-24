import { useState, useEffect } from 'react'

const GRAPHQL_URL = 'https://taxonomy.api.jobtechdev.se/v1/taxonomy/graphql'
const QUERY = `
  {
    concepts(type: "region", limit: 100) {
      id
      preferred_label
      narrower {
        id
        preferred_label
      }
    }
  }
`

export function useGeographyData() {
  const [lanData, setLanData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `${GRAPHQL_URL}?query=${encodeURIComponent(QUERY)}`,
        )
        if (!res.ok)
          throw new Error('Something went wrong while fetching geography')
        const json = await res.json()
        const concepts = json?.data?.concepts ?? []
        const result = {}
        concepts
          .filter((r) => r.preferred_label.endsWith('län'))
          .forEach((lan) => {
            result[lan.preferred_label] = {
              id: lan.id,
              kommuner: (lan.narrower ?? [])
                .map((k) => ({ id: k.id, label: k.preferred_label }))
                .sort((a, b) => a.label.localeCompare(b.label)),
            }
          })
        setLanData(result)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return { lanData, loading, error }
}
