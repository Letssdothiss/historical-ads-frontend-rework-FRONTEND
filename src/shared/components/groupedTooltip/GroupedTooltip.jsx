import './GroupedTooltip.css'

export default function GroupedTooltip({ title, grouped }) {
  const entries = Object.entries(grouped)
  if (entries.length === 0) return null

  return (
    <div className="grouped-tooltip">
      <span className="grouped-tooltip__title">{title}</span>
      <div className="grouped-tooltip__divider grouped-tooltip__divider--full" />
      {entries.map(([group, items], index) => (
        <div key={group} className="grouped-tooltip__section">
          <span className="grouped-tooltip__group">{group}</span>
          <div className="grouped-tooltip__divider" />
          {items.map((item) => (
            <span key={item} className="grouped-tooltip__item">
              {item}
            </span>
          ))}
          {index < entries.length - 1 && (
            <div className="grouped-tooltip__spacer" />
          )}
        </div>
      ))}
    </div>
  )
}
