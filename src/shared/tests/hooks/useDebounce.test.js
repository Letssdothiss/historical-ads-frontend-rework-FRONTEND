import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useDebounce } from '../../hooks/useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 400))

    expect(result.current).toBe('hello')
  })

  it('updates the value after the delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'a', delay: 400 } },
    )

    rerender({ value: 'b', delay: 400 })
    expect(result.current).toBe('a')

    act(() => {
      vi.advanceTimersByTime(400)
    })

    expect(result.current).toBe('b')
  })

  it('resets the timer when the value changes again', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'first' } },
    )

    rerender({ value: 'second' })
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(result.current).toBe('first')

    rerender({ value: 'third' })
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(result.current).toBe('first')

    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(result.current).toBe('third')
  })
})
