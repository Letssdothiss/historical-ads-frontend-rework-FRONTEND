import './SkeletonLoader.css';

/*
 * Skeleton loader component
 *
 * Mimics the structure of incoming content
 * while data is loading.
 *
 * Used for:
 * - Result lists
 * - Cards
 * - Page sections
 * - Placeholder content
 */

function SkeletonLoader() {
  return (
    <div
      className="skeleton-loader"
      aria-live="polite"
      aria-label="Laddar innehåll"
    >
      <div className="skeleton-card">

        {/* Placeholder title */}
        <div className="skeleton-title"></div>

        {/* Placeholder text rows */}
        <div className="skeleton-line"></div>

        <div className="skeleton-line"></div>

        <div className="skeleton-line short"></div>

      </div>
    </div>
  );
}

export default SkeletonLoader;