import { useWineOptions } from './useWineOptions'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

export const useCachedColors = () => {
  const { fetchColors } = useWineOptions()
  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['wine-colors'],
    queryFn: () => fetchColors(),
    staleTime: 2 * 60 * 1000,
  })

  const refreshColors = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['wine-colors'] })
  }, [queryClient])

  return {
    cachedColors: data || [],
    isLoading,
    isError,
    error,
    refreshColors,
  }
}
