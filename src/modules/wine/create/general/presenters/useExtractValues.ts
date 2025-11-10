import { useMemo } from 'react'

export const useExtractValues = <T, K extends keyof T>(
  objects: T[],
  key: K
): T[K][] => {
  return useMemo(() => {
    return objects.map(obj => obj[key])
  }, [objects, key])
}