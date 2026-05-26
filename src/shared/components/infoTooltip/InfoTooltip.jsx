import { useEffect, useId, useRef, useState } from 'react'
import './InfoTooltip.css'

const HOVER_CLOSE_DELAY_MS = 80

/**
 * Info icon with tooltip on hover, focus, or click. Closes when pointer leaves
 * the icon, hover bridge, and bubble (not only when leaving the bubble).
 */
export default function InfoTooltip({
  label = 'Visa mer information',
  children,
}) {
  const [open, setOpen] = useState(false)
  const tooltipId = useId()
  const wrapperRef = useRef(null)
  const closeTimerRef = useRef(null)

  const cancelScheduledClose = () => {
    if (closeTimerRef.current != null) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  const scheduleClose = () => {
    cancelScheduledClose()
    closeTimerRef.current = setTimeout(
      () => setOpen(false),
      HOVER_CLOSE_DELAY_MS,
    )
  }

  const openTooltip = () => {
    cancelScheduledClose()
    setOpen(true)
  }

  const isStillInside = (target) =>
    target instanceof Node && wrapperRef.current?.contains(target)

  const handlePointerLeave = (event) => {
    if (isStillInside(event.relatedTarget)) return
    scheduleClose()
  }

  useEffect(() => () => cancelScheduledClose(), [])

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
    <span
      className="info-tooltip"
      ref={wrapperRef}
      onMouseEnter={openTooltip}
      onMouseLeave={handlePointerLeave}
    >
      <digi-icon-notification-info
        type="button"
        className="info-tooltip__trigger"
        aria-label={label}
        aria-expanded={open}
        aria-controls={tooltipId}
        onClick={() => setOpen((value) => !value)}
        onMouseLeave={handlePointerLeave}
        onFocus={openTooltip}
        onBlur={(event) => {
          if (!isStillInside(event.relatedTarget)) scheduleClose()
        }}
      ></digi-icon-notification-info>
      {open && (
        <>
          <span
            className="info-tooltip__bridge"
            aria-hidden="true"
            onMouseEnter={openTooltip}
            onMouseLeave={handlePointerLeave}
          />
          <span
            id={tooltipId}
            role="tooltip"
            className="info-tooltip__bubble"
            onMouseEnter={openTooltip}
            onMouseLeave={handlePointerLeave}
          >
            {children}
          </span>
        </>
      )}
    </span>
  )
}
