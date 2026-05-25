import { describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { usePagination } from '../../hooks/UsePagination'
import { PAGE_SIZE } from '../../constants/ui'

describe('usePagination', () => {
  it('starts on page 1 with zero offset', () => {
    const { result } = renderHook(() => usePagination())

    expect(result.current.offset).toBe(0)
    expect(result.current.currentPage).toBe(1)
    expect(result.current.pageSize).toBe(PAGE_SIZE)
  })

  it('goToPage updates offset and current page', () => {
    const { result } = renderHook(() => usePagination(10))

    act(() => {
      result.current.goToPage(3)
    })

    expect(result.current.offset).toBe(20)
    expect(result.current.currentPage).toBe(3)
    expect(result.current.pageSize).toBe(10)
  })

  it('reset returns to the first page', () => {
    const { result } = renderHook(() => usePagination(25))

    act(() => {
      result.current.goToPage(4)
      result.current.reset()
    })

    expect(result.current.offset).toBe(0)
    expect(result.current.currentPage).toBe(1)
  })
})
