import { useLocation, useNavigate } from 'react-router-dom'
import TabsSwitch from '../tabsSwitch/TabsSwitch'
import { ROUTES } from '../../constants/routes'
import './ContentWrapper.css'

export default function ContentWrapper({
  children,
  onReset,
  isResultsView = false,
  hideRensaLink = false,
  contentClassName = '',
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
      <div
        className={`shell-top-row${isResultsView ? ' shell-top-row--results' : ''}`}
      >
        <div className="shell-header-container">
          <div className="shell-header-content-container">
            <h2>Historiska platsannonser</h2>
            {!isResultsView && (
              <>
                <p>Platsannonser tidigare publicerade på</p>
                <p>Platsbanken</p>
              </>
            )}
          </div>
        </div>
        <div className="shell-corner-actions">
          {!isResultsView && !hideRensaLink && (
            <button
              type="button"
              className="shell-reset-link"
              onClick={handleClear}
            >
              Rensa
            </button>
          )}
          <div className="tabsswitch-component-container">
            <TabsSwitch />
          </div>
        </div>
      </div>
      <div
        className={`shell-form-container${contentClassName ? ` ${contentClassName}` : ''}`}
      >
        {children}
      </div>
    </section>
  )
}
