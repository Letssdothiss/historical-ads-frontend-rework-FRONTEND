import { useLocation, useNavigate } from 'react-router-dom'
import TabsSwitch from '../tabsSwitch/TabsSwitch'
import { ROUTES } from '../../constants/routes'
import './ContentWrapper.css'

export default function ContentWrapper({
  children,
  onReset,
  hideRensaLink = false,
}) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleClear = () => {
    onReset?.()
    if (location.pathname.startsWith(ROUTES.STATISTICS)) {
      navigate(ROUTES.STATISTICS, { replace: true })
    } else if (location.pathname.startsWith(ROUTES.ABOUT)) {
      navigate(ROUTES.ABOUT, { replace: true })
    } else {
      navigate(ROUTES.JOB_ADS, { replace: true })
    }
  }

  return (
    <section className="shell-section">
      <div className="shell-top-row">
        <div className="shell-header-container">
          <div className="shell-header-content-container">
            <h2>Historiska platsannonser</h2>
            <p>Platsannonser tidigare publicerade på</p>
            <p>Platsbanken</p>
          </div>
        </div>

        <div className="tabsswitch-component-container">
          <button
            type="button"
            className={`shell-reset-link${hideRensaLink ? ' shell-reset-link--hidden' : ''}`}
            onClick={handleClear}
            aria-hidden={hideRensaLink}
            tabIndex={hideRensaLink ? -1 : 0}
          >
            Rensa
          </button>
          <TabsSwitch />
        </div>
      </div>

      <div className="shell-form-container">{children}</div>
    </section>
  )
}
