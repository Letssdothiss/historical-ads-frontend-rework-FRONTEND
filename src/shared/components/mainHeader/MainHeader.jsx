import { DigiLogo } from '@designsystem-se/af-react'
import { LogoColor } from '@designsystem-se/af'
import './MainHeader.css'

export default function MainHeader() {
  return (
    <header id="layout-section">
      <div className="logo-container">
        <DigiLogo afOnlySymbol={false} afColor={LogoColor.PRIMARY} />
      </div>
      <div className="logo-divider" aria-hidden="true" />
    </header>
  )
}
