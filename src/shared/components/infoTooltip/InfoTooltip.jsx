import { useEffect, useId, useRef, useState } from 'react'
import './InfoTooltip.css'
/**
 * Component to show an info icon that reveals a tooltip with more information on click/hover/focus. The tooltip can contain any content passed as children.
 */
export default function InfoTooltip({
  label = 'Visa mer information',
  children,
}) {
  const [open, setOpen] = useState(false)
  const tooltipId = useId()
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDocClick = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setOpen(false)
    }
    const onKey = (event) => event.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <span className="info-tooltip" ref={wrapperRef}>
      <digi-icon-notification-info
        type="button"
        className="info-tooltip__trigger"
        aria-label={label}
        aria-expanded={open}
        aria-controls={tooltipId}
        onClick={() => setOpen((value) => !value)}
        onMouseEnter={() => setOpen(true)}
        onFocus={() => setOpen(true)}
      ></digi-icon-notification-info>
      {open && (
        <span
          id={tooltipId}
          role="tooltip"
          className="info-tooltip__bubble"
          onMouseLeave={() => setOpen(false)}
        >
          {children}
        </span>
      )}
    </span>
  )
}
