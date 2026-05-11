import { useState, useEffect } from 'react'

const BASE_URL = 'https://taxonomy.api.jobtechdev.se/v1/taxonomy/specific/concepts'

const lanskoder = {
  '01': 'Stockholms län',
  '03': 'Uppsala län',
  '04': 'Södermanlands län',
  '05': 'Östergötlands län',
  '06': 'Jönköpings län',
  '07': 'Kronobergs län',
  '08': 'Kalmar län',
  '09': 'Gotlands län',
  '10': 'Blekinge län',
  '12': 'Skåne län',
  '13': 'Hallands län',
  '14': 'Västra Götalands län',
  '17': 'Värmlands län',
  '18': 'Örebro län',
  '19': 'Västmanlands län',
  '20': 'Dalarnas län',
  '21': 'Gävleborgs län',
  '22': 'Västernorrlands län',
  '23': 'Jämtlands län',
  '24': 'Västerbottens län',
  '25': 'Norrbottens län',
}

export function useLanData() {
  const [lanData, setLanData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [lanRes, kommunRes] = await Promise.all([
          fetch(`${BASE_URL}/region?limit=500`),
          fetch(`${BASE_URL}/municipality?limit=500`),
        ])

        if (!lanRes.ok || !kommunRes.ok) {
          throw new Error('Något gick fel vid hämtning av geografi')
        }

        const lanJson = await lanRes.json()
        const kommunJson = await kommunRes.json()

        const result = {}

        lanJson
          .filter(l => l['taxonomy/definition'].endsWith('län'))
          .forEach(l => {
            result[l['taxonomy/definition']] = []
          })

        kommunJson.forEach(k => {
          const kod = k['taxonomy/lau-2-code-2015']?.substring(0, 2)
          const lanNamn = lanskoder[kod]
          if (lanNamn && result[lanNamn]) {
            result[lanNamn].push(k['taxonomy/definition'])
          }
        })

        Object.keys(result).forEach(lan => result[lan].sort())

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
