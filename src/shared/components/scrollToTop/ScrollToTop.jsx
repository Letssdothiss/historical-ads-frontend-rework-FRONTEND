import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { getMainTabSection } from '../../constants/routes'

export default function ScrollToTop() {
  const { pathname } = useLocation()
  const prevSectionRef = useRef(getMainTabSection(pathname))

  useEffect(() => {
    const currentSection = getMainTabSection(pathname)
    const prevSection = prevSectionRef.current

    if (currentSection && prevSection && currentSection !== prevSection) {
      window.scrollTo(0, 0)
    }

    prevSectionRef.current = currentSection
  }, [pathname])

  return null
}
