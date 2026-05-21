import { useState, useCallback } from 'react'
import { PAGE_SIZE } from '../constants/ui'

// Custom hook for managing pagination state
export function usePagination(pageSize = PAGE_SIZE) {
  const [offset, setOffset] = useState(0)

  const currentPage = Math.floor(offset / pageSize) + 1

  const goToPage = useCallback(
    (page) => setOffset((page - 1) * pageSize),
    [pageSize],
  )

  const reset = useCallback(() => setOffset(0), [])

  return { offset, currentPage, pageSize, goToPage, reset }
}
