import { DigiIconChevronDown } from '@designsystem-se/af-react'
import './ResultsAdjustSearch.css'

/**
 * Collapsible “Justera sökning” on results pages. Toggle stays centered below the form.
 */
export default function ResultsAdjustSearch({ open, onToggle, children }) {
  return (
    <div className="results-adjust">
      {open && <div className="results-adjust__panel">{children}</div>}
      <button
        type="button"
        className="results-adjust__toggle"
        onClick={onToggle}
        aria-expanded={open}
      >
        <span>Justera sökning</span>
        <span
          className={
            open
              ? 'results-adjust__chevron results-adjust__chevron--open'
              : 'results-adjust__chevron'
          }
        >
          <DigiIconChevronDown />
        </span>
      </button>
    </div>
  )
}
