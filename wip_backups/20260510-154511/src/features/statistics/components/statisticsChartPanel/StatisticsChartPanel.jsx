import { useState, useMemo } from 'react'
import './StatisticsChartPanel.css'
import {
  DigiButton,
  DigiDialog,
  DigiTable,
  DigiFormRadiobutton,
  DigiFormRadiogroup,
} from '@designsystem-se/af-react'
import { ButtonVariation, ButtonType, TableVariation } from '@designsystem-se/af'
import BarChart from '../charts/barChart/BarChart'
import LineChart from '../charts/lineChart/LineChart'
import { toAndel } from '../../utils/StatisticsTransformers'
import { exportStatistics } from '../../api/StatisticsApi'

const VISNING_OPTIONS = [
  { id: 'tabell', label: 'Tabell – Sorterad' },
  { id: 'kolumn', label: 'Diagram – Kolumn' },
  { id: 'stapel', label: 'Diagram – Staplad kolumn' },
  { id: 'linje', label: 'Diagram – Linje' },
]

const EXPORT_OPTIONS = [
  { id: 'xlsx', label: 'Excel (*.xlsx)' },
  { id: 'json', label: 'JSON (.json)' },
  { id: 'png', label: 'Diagram som PNG' },
  { id: 'pdf', label: 'Diagram som PDF' },
]

const MOCK_DATA = [
  { lan: 'Stockholms län', '2024': 2950, '2025': 3420, '2026': 3980 },
  { lan: 'Skåne län',      '2024': 1420, '2025': 1630, '2026': 1650 },
  { lan: 'Uppsala län',    '2024': 320,  '2025': 390,  '2026': 450  },
  { lan: 'Hallands län',   '2024': 320,  '2025': 390,  '2026': 450  },
  { lan: 'Örebro län',     '2024': 1231, '2025': 2123, '2026': 4121 },
]

function buildSummary(params) {
  if (!params) return 'Sökresultat'
  const parts = []
  if (params.kompetens) parts.push(params.kompetens)
  if (params.lan?.length) parts.push(params.lan.join(', '))
  if (params.ar?.length) parts.push(params.ar.join(', '))
  return parts.length > 0 ? parts.join(' — ') : 'Sökresultat'
}

function StatisticsChartPanel({ data = MOCK_DATA, searchParams = {} }) {
  const [visning, setVisning] = useState('tabell')
  const [enhet, setEnhet] = useState('antal')
  const [exportOpen, setExportOpen] = useState(false)
  const [presentationOpen, setPresentationOpen] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [toast, setToast] = useState(null)
  const [sortCol, setSortCol] = useState(null)
  const [sortDir, setSortDir] = useState('desc')

  const years = data.length > 0 ? Object.keys(data[0]).filter(k => k !== 'lan') : []
  const searchSummary = buildSummary(searchParams)
  const displayData = enhet === 'andel' ? toAndel(data) : data

  const sortedData = useMemo(() => {
    if (!sortCol) return displayData
    return [...displayData].sort((a, b) => {
      if (sortCol === 'lan') {
        return sortDir === 'asc'
          ? a.lan.localeCompare(b.lan, 'sv')
          : b.lan.localeCompare(a.lan, 'sv')
      }
      const aVal = Number(a[sortCol]) || 0
      const bVal = Number(b[sortCol]) || 0
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal
    })
  }, [displayData, sortCol, sortDir])

  const handleSort = (col) => {
    if (sortCol === col) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortCol(col)
      setSortDir('desc')
    }
  }

  const sortIcon = (col) => {
    if (sortCol !== col) return ' ↕'
    return sortDir === 'asc' ? ' ↑' : ' ↓'
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 4000)
  }

  const handleExport = async (format) => {
    setExportOpen(false)

    if (format === 'png' || format === 'pdf') {
      alert(`${format.toUpperCase()}-export är inte tillgänglig ännu.`)
      return
    }

    setExporting(true)
    try {
      await exportStatistics(searchParams, format)
      showToast(`${format === 'xlsx' ? 'Excel' : 'JSON'}-fil laddades ned ✓`)
    } catch (err) {
      console.error('[StatisticsChartPanel] Export misslyckades:', err)
      showToast('Export misslyckades — se konsolen')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="statistics-chart-panel">

      {toast && (
        <div className="statistics-chart-panel__toast">{toast}</div>
      )}

      <div className="statistics-chart-panel__toolbar">
        <h2 className="statistics-chart-panel__summary">{searchSummary}</h2>

        <div className="statistics-chart-panel__buttons">

          <div className="statistics-chart-panel__dropdown-wrapper">
            <DigiButton
              afVariation={ButtonVariation.SECONDARY}
              afType={ButtonType.BUTTON}
              onAfOnClick={() => setPresentationOpen(prev => !prev)}
            >
              Välj presentationsform
            </DigiButton>
            {presentationOpen && (
              <ul className="statistics-chart-panel__dropdown-menu" role="menu">
                {VISNING_OPTIONS.map(opt => (
                  <li key={opt.id} role="menuitem">
                    <button
                      className={
                        'statistics-chart-panel__dropdown-item' +
                        (visning === opt.id ? ' statistics-chart-panel__dropdown-item--active' : '')
                      }
                      onClick={() => {
                        setVisning(opt.id)
                        setPresentationOpen(false)
                      }}
                    >
                      {opt.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <DigiButton
            afVariation={ButtonVariation.SECONDARY}
            afType={ButtonType.BUTTON}
            onAfOnClick={() => console.log('Spara sökning — ej implementerat')}
          >
            Spara sökning
          </DigiButton>

          <DigiButton
            afVariation={ButtonVariation.SECONDARY}
            afType={ButtonType.BUTTON}
            onAfOnClick={() => setExportOpen(true)}
          >
            {exporting ? 'Exporterar...' : 'Exportera sökresultat'}
          </DigiButton>

        </div>
      </div>

      <div className="statistics-chart-panel__content">
        {visning === 'tabell' && (
          <DigiTable afVariation={TableVariation.PRIMARY}>
            <table>
              <thead>
                <tr>
                  <th scope="col">
                    <button className="statistics-chart-panel__sort-btn" onClick={() => handleSort('lan')}>
                      Län{sortIcon('lan')}
                    </button>
                  </th>
                  {years.map(y => (
                    <th key={y} scope="col">
                      <button className="statistics-chart-panel__sort-btn" onClick={() => handleSort(y)}>
                        {y}{sortIcon(y)}
                      </button>
                    </th>
                  ))}
                  {years.length > 1 && <th scope="col">Totalt</th>}
                </tr>
              </thead>
              <tbody>
                {sortedData.map((row, i) => (
                  <tr key={i}>
                    <td>{row.lan}</td>
                    {years.map(y => <td key={y}>{row[y]}</td>)}
                    {years.length > 1 && (
                      <td>
                        {enhet === 'antal'
                          ? years.reduce((sum, y) => sum + (Number(row[y]) || 0), 0)
                          : '100%'
                        }
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </DigiTable>
        )}

        {(visning === 'kolumn' || visning === 'stapel') && (
          <BarChart data={data} stacked={visning === 'stapel'} />
        )}

        {visning === 'linje' && (
          <LineChart data={data} />
        )}
      </div>

      <div className="statistics-chart-panel__toggle">
        <DigiFormRadiogroup afValue={enhet}>
          <DigiFormRadiobutton
            afLabel="Antal"
            afValue="antal"
            afChecked={enhet === 'antal'}
            onAfOnChange={() => setEnhet('antal')}
          />
          <DigiFormRadiobutton
            afLabel="Andel"
            afValue="andel"
            afChecked={enhet === 'andel'}
            onAfOnChange={() => setEnhet('andel')}
          />
        </DigiFormRadiogroup>
      </div>

      <DigiDialog
        afShowDialog={exportOpen}
        afHeading="Exportera sökresultat"
        afCloseButtonText="Stäng"
        onAfOnClose={() => setExportOpen(false)}
      >
        <ul className="statistics-chart-panel__export-list">
          {EXPORT_OPTIONS.map(opt => (
            <li key={opt.id}>
              <button
                className="statistics-chart-panel__export-option"
                onClick={() => handleExport(opt.id)}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      </DigiDialog>

    </div>
  )
}

export default StatisticsChartPanel
