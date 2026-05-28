import { NavLink, useLocation } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import './TabsSwitch.css'

const TABS = [
  { to: ROUTES.JOB_ADS, label: 'Platsannonser', prefix: '/platsannonser' },
  { to: ROUTES.STATISTICS, label: 'Statistik', prefix: '/statistik' },
  { to: ROUTES.ABOUT, label: 'Om datan', prefix: '/om-datan' },
]

export default function TabsSwitch() {
  const location = useLocation()
  const isAboutActive = location.pathname.startsWith(ROUTES.ABOUT)

  return (
    <nav
      className={`tabs-switch${isAboutActive ? ' tabs-switch--flat-bottom' : ''}`}
      aria-label="Huvudnavigering"
    >
      {TABS.map((tab) => {
        const isActive = location.pathname.startsWith(tab.prefix)
        return (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={
              isActive
                ? 'tabs-switch__link tabs-switch__link--active'
                : 'tabs-switch__link'
            }
          >
            {tab.label}
          </NavLink>
        )
      })}
    </nav>
  )
}
