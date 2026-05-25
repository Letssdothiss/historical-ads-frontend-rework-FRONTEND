/** Shared Digi stubs for integration tests (avoids custom-element issues in jsdom). */

export const DigiButton = ({ children, onAfOnClick, afType }) => (
  <button
    type={afType === 'submit' ? 'submit' : 'button'}
    onClick={onAfOnClick}
  >
    {children}
  </button>
)

export const DigiCard = ({ children }) => (
  <div data-testid="digi-card">{children}</div>
)

export const DigiIconChevronDown = () => null
