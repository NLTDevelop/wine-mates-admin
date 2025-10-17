import { useCallback, useRef } from 'react'

export const useDebounce = (callback: Function, delay: number) => {
  const timer = useRef<NodeJS.Timeout | null>(null)

  const debouncedWrapper = useCallback(
    (...args: any[]) => {
      if (timer.current) {
        clearTimeout(timer.current)
      }
      timer.current = setTimeout(() => {
        callback(...args)
      }, delay) as unknown as NodeJS.Timeout
    },
    [callback, delay]
  )

  return { debouncedWrapper }
}
