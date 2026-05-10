import './ErrorState.css';

import {
  DigiButton,
} from '@designsystem-se/af-react';

/*
 * Reusable error state component.
 * Used when content or API data fails to load.
 *
 * Example:
 * <ErrorState
 *   title="Något gick fel"
 *   message="Det gick inte att hämta platsannonser."
 *   onRetry={fetchData}
 * />
 */

function ErrorState({
  title = 'Något gick fel',
  message = 'Det gick inte att hämta innehållet.',
  onRetry,
}) {
  return (
    <div
      className="error-state"
      role="alert"
      aria-live="polite"
    >
      {/* Warning icon */}
      <digi-icon-exclamation-triangle-warning
        class="error-icon"
      ></digi-icon-exclamation-triangle-warning>

      {/* Error heading */}
      <h2 className="error-title">
        {title}
      </h2>

      {/* Error message */}
      <p className="error-message">
        {message}
      </p>

      {/* Optional retry button */}
      {onRetry && (
        <DigiButton
          afVariation="primary"
          afType="button"
          onAfOnClick={onRetry}
        >
          Försök igen
        </DigiButton>
      )}
    </div>
  );
}

export default ErrorState;