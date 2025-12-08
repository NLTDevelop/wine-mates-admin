import { useWineOptions } from './useWineOptions'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

export const useCachedWineTypes = () => {
  const { fetchWineTypes } = useWineOptions()
  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['types'],
    queryFn: () => fetchWineTypes(),
    staleTime: 2 * 60 * 1000,
  })

  const refreshWineTypes = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['types'] })
  }, [queryClient])

  return {
    cachedWineTypes: data || [],
    isLoading,
    isError,
    error,
    refreshWineTypes,
  }
}
