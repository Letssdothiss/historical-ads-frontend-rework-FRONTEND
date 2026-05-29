import {
  ButtonType,
  ButtonVariation,
  TableVariation,
} from '@designsystem-se/af'
import {
  DigiButton,
  DigiFormCheckbox,
  DigiFormRadiobutton,
  DigiFormRadiogroup,
  DigiIconBookmarkOutline,
  DigiIconChevronRight,
  DigiIconChevronUp,
  DigiIconFileExport,
  DigiIconPen,
  DigiTable,
} from '@designsystem-se/af-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { exportStatistics } from '../../api/StatisticsApi'
import {
  mapStatisticsByMonth,
  mapStatisticsByMunicipality,
} from '../../api/StatisticsMapper'
import { toAndel } from '../../utils/StatisticsTransformers'
import { formatPeriodLabel } from '../../../../shared/utils/monthLabels'
import BarChart from '../charts/barChart/BarChart'
import LineChart from '../charts/lineChart/LineChart'
import './StatisticsChartPanel.css'

const VISNING_OPTIONS = [
  { id: 'tabell', label: 'Tabell - Sorterad' },
  { id: 'kolumn', label: 'Diagram - Kolumn' },
  { id: 'linje', label: 'Diagram - Linje' },
]

const PIVOT_OPTIONS = [
  { id: 'medsols', label: 'Pivotera medsols' },
  { id: 'motsols', label: 'Pivotera motsols' },
]

const DETAIL_LEVELS = [
  { id: 'ar', label: 'Visa år' },
  { id: 'manader', label: 'Visa månader' },
  { id: 'lan', label: 'Visa län' },
  { id: 'kommuner', label: 'Visa kommuner' },
]

const EXPORT_OPTIONS = [
  { id: 'xlsx', label: 'Excel (*.xlsx)' },
  { id: 'json', label: 'Json (json)' },
  { id: 'png', label: 'Diagram som PNG' },
  { id: 'pdf', label: 'Diagram som PDF' },
]

function buildSummary(params) {
  if (!params) return 'Sökresultat'
  const parts = []
  if (params.kompetens) parts.push(params.kompetens)
  if (params.yrkesgrupper?.length) parts.push(params.yrkesgrupper.join(', '))
  if (params.lan?.length) parts.push(params.lan.join(', '))
  const period = formatPeriodLabel(params.ar, params.manader)
  if (period) parts.push(period)
  return parts.length > 0 ? parts.join(' — ') : 'Sökresultat'
}

function StatisticsChartPanel({
  data = [],
  yearResults = [],
  searchParams = {},
}) {
  const [visning, setVisning] = useState('tabell')
  const [enhet, setEnhet] = useState('antal')
  const [pivot, setPivot] = useState(null)
  const [detailLevel, setDetailLevel] = useState('ar')
  const [presentationOpen, setPresentationOpen] = useState(false)
  const [activePresentationSection, setActivePresentationSection] =
    useState('visning')
  const [exportOpen, setExportOpen] = useState(false)
  const [exportFormat, setExportFormat] = useState(null)
  const [exporting, setExporting] = useState(false)
  const [toast, setToast] = useState(null)
  const [sortCol, setSortCol] = useState(null)
  const [sortDir, setSortDir] = useState('desc')

  const presentationRef = useRef(null)
  const exportRef = useRef(null)

  useEffect(() => {
    const onDocClick = (event) => {
      if (
        presentationOpen &&
        !presentationRef.current?.contains(event.target)
      ) {
        setPresentationOpen(false)
      }
      if (exportOpen && !exportRef.current?.contains(event.target)) {
        setExportOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [presentationOpen, exportOpen])

  const monthDataAvailable = useMemo(
    () =>
      yearResults.some(
        ({ raw }) => (raw?.stats?.month ?? raw?.month)?.length > 0,
      ),
    [yearResults],
  )

  const municipalityDataAvailable = useMemo(
    () =>
      yearResults.some(
        ({ raw }) =>
          (raw?.stats?.municipality ?? raw?.municipality)?.length > 0,
      ),
    [yearResults],
  )

  const activeData = useMemo(() => {
    if (detailLevel === 'manader')
      return monthDataAvailable ? mapStatisticsByMonth(yearResults) : data
    if (detailLevel === 'kommuner')
      return municipalityDataAvailable
        ? mapStatisticsByMunicipality(yearResults)
        : data
    return data
  }, [
    detailLevel,
    monthDataAvailable,
    municipalityDataAvailable,
    yearResults,
    data,
  ])

  const isPivoted = pivot === 'medsols' || pivot === 'manuellt'

  useEffect(() => {
    // Keep table sorting predictable when pivot mode changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSortCol(null)
    setSortDir('desc')
  }, [isPivoted])

  const pivotedData = useMemo(() => {
    if (!isPivoted || activeData.length === 0) return activeData
    const cols = Object.keys(activeData[0]).filter((k) => k !== 'lan')
    return cols.map((col) => {
      const row = { lan: col }
      activeData.forEach((r) => {
        row[r.lan] = r[col]
      })
      return row
    })
  }, [isPivoted, activeData])

  const years = useMemo(
    () =>
      pivotedData.length > 0
        ? Object.keys(pivotedData[0]).filter((k) => k !== 'lan')
        : [],
    [pivotedData],
  )
  const trendRowLabel = searchParams.trend
    ? searchParams.trend === 'top5_skills'
      ? 'Kompetens'
      : 'Yrkesgrupp'
    : null
  const rowLabel = isPivoted
    ? 'År'
    : (trendRowLabel ??
      (detailLevel === 'manader'
        ? 'Månad'
        : detailLevel === 'kommuner'
          ? 'Kommun'
          : 'Län'))
  const searchSummary = buildSummary(searchParams)
  const displayData = enhet === 'andel' ? toAndel(pivotedData) : pivotedData
  const totalAnnonser = useMemo(
    () =>
      pivotedData.reduce(
        (sum, row) =>
          sum + years.reduce((rowSum, y) => rowSum + (Number(row[y]) || 0), 0),
        0,
      ),
    [pivotedData, years],
  )

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
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))
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

  const toggleDetailLevel = (id) => {
    setDetailLevel(id)
  }

  const handleExport = async (format) => {
    if (!format) return

    if (format === 'png' || format === 'pdf') {
      showToast(`${format.toUpperCase()}-export är inte tillgänglig ännu.`)
      setExportOpen(false)
      setExportFormat(null)
      return
    }

    setExporting(true)
    setExportOpen(false)
    try {
      await exportStatistics(searchParams, format)
      showToast(`${format === 'xlsx' ? 'Excel' : 'JSON'}-fil laddades ned ✓`)
    } catch (err) {
      console.error('[StatisticsChartPanel] Export misslyckades:', err)
      showToast('Export misslyckades — se konsolen')
    } finally {
      setExporting(false)
      setExportFormat(null)
    }
  }

  const saveSearch = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      showToast('Länk till sökningen kopierad ✓')
    } catch {
      showToast('Kunde inte kopiera länken')
    }
  }

  return (
    <div className="statistics-chart-panel">
      {toast && <div className="statistics-chart-panel__toast">{toast}</div>}

      <div className="statistics-chart-panel__buttons">
        <div
          className="statistics-chart-panel__dropdown-wrapper"
          ref={presentationRef}
        >
          <DigiButton
            afVariation={ButtonVariation.SECONDARY}
            afType={ButtonType.BUTTON}
            onAfOnClick={() => setPresentationOpen((prev) => !prev)}
          >
            <span className="statistics-chart-panel__btn-content">
              <DigiIconPen />
              <span>Välj presentationsform</span>
              <DigiIconChevronUp
                className={
                  presentationOpen
                    ? 'statistics-chart-panel__chevron statistics-chart-panel__chevron--open'
                    : 'statistics-chart-panel__chevron'
                }
              />
            </span>
          </DigiButton>

          {presentationOpen && (
            <div className="statistics-chart-panel__presentation-menu">
              <ul
                className="statistics-chart-panel__menu-col"
                role="menu"
                aria-label="Presentationsform"
              >
                {[
                  { id: 'visning', label: 'Visa resultatet som' },
                  { id: 'pivot', label: 'Pivotera' },
                  { id: 'detalj', label: 'Val av detaljnivå' },
                ].map((section) => (
                  <li key={section.id}>
                    <button
                      type="button"
                      className={
                        activePresentationSection === section.id
                          ? 'statistics-chart-panel__menu-row statistics-chart-panel__menu-row--active'
                          : 'statistics-chart-panel__menu-row'
                      }
                      onClick={() => setActivePresentationSection(section.id)}
                    >
                      <span>{section.label}</span>
                      <DigiIconChevronRight />
                    </button>
                  </li>
                ))}
              </ul>

              <div className="statistics-chart-panel__menu-col statistics-chart-panel__menu-col--right">
                {activePresentationSection === 'visning' &&
                  VISNING_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={
                        visning === opt.id
                          ? 'statistics-chart-panel__menu-item statistics-chart-panel__menu-item--selected'
                          : 'statistics-chart-panel__menu-item'
                      }
                      onClick={() => {
                        setVisning(opt.id)
                        setPresentationOpen(false)
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}

                {activePresentationSection === 'pivot' &&
                  PIVOT_OPTIONS.map((opt) => (
                    <DigiFormCheckbox
                      key={opt.id}
                      afLabel={opt.label}
                      afChecked={pivot === opt.id}
                      onAfOnChange={() =>
                        setPivot(pivot === opt.id ? null : opt.id)
                      }
                      className="statistics-chart-panel__menu-check"
                    />
                  ))}

                {activePresentationSection === 'detalj' &&
                  DETAIL_LEVELS.map((opt) => (
                    <DigiFormCheckbox
                      key={opt.id}
                      afLabel={opt.label}
                      afChecked={detailLevel === opt.id}
                      onAfOnChange={() => toggleDetailLevel(opt.id)}
                      className="statistics-chart-panel__menu-check"
                    />
                  ))}
              </div>
            </div>
          )}
        </div>

        <div
          className="statistics-chart-panel__dropdown-wrapper"
          ref={exportRef}
        >
          <DigiButton
            afVariation={ButtonVariation.SECONDARY}
            afType={ButtonType.BUTTON}
            onAfOnClick={() => setExportOpen((prev) => !prev)}
          >
            <span className="statistics-chart-panel__btn-content">
              <DigiIconFileExport />
              <span>
                {exporting ? 'Exporterar...' : 'Exportera sökresultat'}
              </span>
              <DigiIconChevronUp
                className={
                  exportOpen
                    ? 'statistics-chart-panel__chevron statistics-chart-panel__chevron--open'
                    : 'statistics-chart-panel__chevron'
                }
              />
            </span>
          </DigiButton>

          {exportOpen && (
            <div className="statistics-chart-panel__export-menu">
              <ul className="statistics-chart-panel__export-list">
                {EXPORT_OPTIONS.map((opt) => (
                  <li key={opt.id}>
                    <button
                      type="button"
                      className={
                        exportFormat === opt.id
                          ? 'statistics-chart-panel__export-row statistics-chart-panel__export-row--selected'
                          : 'statistics-chart-panel__export-row'
                      }
                      onClick={() => setExportFormat(opt.id)}
                    >
                      {exportFormat === opt.id && <span>✓ </span>}
                      {opt.label}
                    </button>
                  </li>
                ))}
              </ul>
              {exportFormat && (
                <div className="statistics-chart-panel__export-confirm">
                  <DigiButton
                    afVariation={ButtonVariation.PRIMARY}
                    afType={ButtonType.BUTTON}
                    onAfOnClick={() => handleExport(exportFormat)}
                    afDisabled={exporting}
                  >
                    Exportera
                  </DigiButton>
                </div>
              )}
            </div>
          )}
        </div>

        <DigiButton
          afVariation={ButtonVariation.SECONDARY}
          afType={ButtonType.BUTTON}
          onAfOnClick={saveSearch}
        >
          <span className="statistics-chart-panel__btn-content">
            <DigiIconBookmarkOutline />
            <span>Spara sökning</span>
          </span>
        </DigiButton>
      </div>

      <div className="statistics-chart-panel__summary-row">
        <h2 className="statistics-chart-panel__summary">{searchSummary}</h2>
        <p className="statistics-chart-panel__count">
          Totalt {totalAnnonser.toLocaleString('sv-SE')} annonser i valt
          geografiskt område under vald tidsperiod
        </p>
      </div>

      <div className="statistics-chart-panel__content">
        {detailLevel === 'manader' && !monthDataAvailable && (
          <p className="statistics-chart-panel__empty">
            Månadsvy är inte tillgänglig — backend stöder inte månadsaggregering
            ännu. Visar årsdata istället.
          </p>
        )}

        {activeData.length === 0 && detailLevel === 'ar' && (
          <p className="statistics-chart-panel__empty">
            Inga resultat för den valda sökningen.
          </p>
        )}

        {activeData.length > 0 && visning === 'tabell' && (
          <DigiTable afVariation={TableVariation.PRIMARY}>
            <table>
              <thead>
                <tr>
                  <th scope="col">
                    <button
                      className="statistics-chart-panel__sort-btn"
                      onClick={() => handleSort('lan')}
                    >
                      {rowLabel}
                      {sortIcon('lan')}
                    </button>
                  </th>
                  {years.map((y) => (
                    <th key={y} scope="col">
                      <button
                        className="statistics-chart-panel__sort-btn"
                        onClick={() => handleSort(y)}
                      >
                        {y}
                        {sortIcon(y)}
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
                    {years.map((y) => (
                      <td key={y}>
                        {enhet === 'andel' ? `${row[y]}%` : row[y]}
                      </td>
                    ))}
                    {years.length > 1 && (
                      <td>
                        {enhet === 'antal'
                          ? years.reduce(
                              (sum, y) => sum + (Number(row[y]) || 0),
                              0,
                            )
                          : '100%'}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </DigiTable>
        )}

        {activeData.length > 0 &&
          (visning === 'kolumn' || visning === 'stapel') && (
            <BarChart data={displayData} stacked={visning === 'stapel'} />
          )}

        {activeData.length > 0 && visning === 'linje' && (
          <LineChart data={displayData} />
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
    </div>
  )
}

export default StatisticsChartPanel
