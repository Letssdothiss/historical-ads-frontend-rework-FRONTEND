import { useState } from 'react'
import './FilterIndicator.css'
// Component to show a dot indicator when filters are applied, and a popup with details on hover/focus
export default function FilterIndicator({ heading, groups = [] }) {
  const [open, setOpen] = useState(false)
  const hasAny = groups.some((group) => group.items?.length > 0)
  if (!hasAny) return null

  return (
    <span
      className="filter-indicator"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      tabIndex={0}
      role="status"
      aria-label="Visa valda alternativ"
    >
      <span className="filter-indicator__dot" aria-hidden="true" />
      {open && (
        <span className="filter-indicator__popup" role="tooltip">
          {heading && (
            <strong className="filter-indicator__heading">{heading}</strong>
          )}
          {groups.map((group) =>
            group.items?.length ? (
              <span key={group.label} className="filter-indicator__group">
                <em className="filter-indicator__group-label">{group.label}</em>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </span>
            ) : null,
          )}
        </span>
      )}
    </span>
  )
}
