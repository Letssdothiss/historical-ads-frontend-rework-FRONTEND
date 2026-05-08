import { DigiNavigationPagination } from '@designsystem-se/af-react'
import { useEffect, useRef } from 'react'
import './JobAdsPagination.css'

const DEFAULT_PAGE_SIZE = 20

function clampPage(page, totalPages) {
  if (!Number.isFinite(page) || page < 1) {
    return 1
  }

  if (!Number.isFinite(totalPages) || totalPages < 1) {
    return page
  }

  return Math.min(page, totalPages)
}

export default function JobAdsPagination({
  currentPage = 1,
  totalPages = 0,
  totalResults,
  resultName = 'annonser',
  pageSize = DEFAULT_PAGE_SIZE,
  onPageChange,
}) {
  const paginationRef = useRef(null)
  const normalizedCurrentPage = clampPage(currentPage, totalPages)
  const showResultBlock = Number.isFinite(totalResults) && totalResults > 0

  const currentResultStart = showResultBlock
    ? Math.min((normalizedCurrentPage - 1) * pageSize + 1, totalResults)
    : undefined
  const currentResultEnd = showResultBlock
    ? Math.min(normalizedCurrentPage * pageSize, totalResults)
    : undefined

  useEffect(() => {
    paginationRef.current?.afMSetCurrentPage?.(normalizedCurrentPage)
  }, [normalizedCurrentPage])

  if (totalPages < 2) {
    return null
  }

  return (
    <div className="job-ads-pagination">
      <DigiNavigationPagination
        ref={paginationRef}
        afInitActivePage={normalizedCurrentPage}
        afTotalPages={totalPages}
        {...(showResultBlock
          ? {
              afTotalResults: totalResults,
              afCurrentResultStart: currentResultStart,
              afCurrentResultEnd: currentResultEnd,
              afResultName: resultName,
            }
          : {})}
        onAfOnPageChange={(event) => {
          onPageChange?.(event.detail)
        }}
      />
    </div>
  )
}
