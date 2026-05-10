import './LoadingState.css';

import {
  DigiLoaderSpinner,
} from '@designsystem-se/af-react';

/*
 * Reusable loading component
 *
 * Used while data or content is loading.
 * Displays AF Designsystem spinner together with
 * accessible loading text.
 */

function LoadingState({
  text = 'Laddar innehåll...',
}) {
  return (
    <div
      className="loading-state"
      role="status"
      aria-live="polite"
    >
      {/* Spinner from AF Designsystem */}
      <DigiLoaderSpinner />

      {/* Loading message */}
      <p className="loading-state-text">
        {text}
      </p>
    </div>
  );
}

export default LoadingState;