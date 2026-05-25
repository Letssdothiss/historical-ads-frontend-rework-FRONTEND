import { useState, useEffect } from 'react'

const GRAPHQL_URL = 'https://taxonomy.api.jobtechdev.se/v1/taxonomy/graphql'
const QUERY = `
  {
    concepts(type: "occupation-field", limit: 100) {
      id
      preferred_label
      narrower {
        id
        preferred_label
      }
    }
  }
`

export function useJobData() {
  const [jobData, setJobData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `${GRAPHQL_URL}?query=${encodeURIComponent(QUERY)}`,
        )
        if (!res.ok) throw new Error('Something went wrong fetching job data')
        const json = await res.json()
        const concepts = json?.data?.concepts ?? []
        const result = {}
        concepts.forEach((field) => {
          result[field.preferred_label] = {
            id: field.id,
            groups: (field.narrower ?? [])
              .map((g) => ({ id: g.id, label: g.preferred_label }))
              .sort((a, b) => a.label.localeCompare(b.label)),
          }
        })
        setJobData(result)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return { jobData, loading, error }
}
