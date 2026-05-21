import './OccupationTooltip.css'

export default function OccupationTooltip({ grouped }) {
  const entries = Object.entries(grouped)
  if (entries.length === 0) return null

  return (
    <div className="occupation-tooltip">
      <span className="occupation-tooltip__title">Valda yrkesgrupper</span>
      <div className="occupation-tooltip__divider" />
      {entries.map(([area, groups], index) => (
        <div key={area} className="occupation-tooltip__section">
          <span className="occupation-tooltip__area">{area}</span>
          <div className="occupation-tooltip__divider" />
          {groups.map((g) => (
            <span key={g} className="occupation-tooltip__group">
              {g}
            </span>
          ))}
          {index < entries.length - 1 && (
            <div className="occupation-tooltip__spacer" />
          )}
        </div>
      ))}
    </div>
  )
}
