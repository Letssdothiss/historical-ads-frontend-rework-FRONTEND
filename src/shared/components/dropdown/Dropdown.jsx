import { useEffect, useRef } from 'react'
import './Dropdown.css'

export default function Dropdown({ trigger, children, isOpen, onClose }) {
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    const onDocClick = (event) => {
      if (!wrapperRef.current?.contains(event.target)) onClose?.()
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [isOpen, onClose])

  return (
    <div className="dropdown" ref={wrapperRef}>
      {trigger}
      {isOpen && <div className="dropdown__panel">{children}</div>}
    </div>
  )
}
