import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { wineOptionsQueries } from '../../wine-types/entities/wine-options-queries'
import { wineTypeQueries } from '../../wine-types/entities/wine-type-queries'

export const useWineOptions = () => {
  const fetchWithErrorHandling = useCallback(async (queryFn: () => Promise<any>) => {
    try {
      return await queryFn()
    } catch (error) {
      console.error('Error fetching wine options:', error)
      return []
    }
  }, [])

  const useColors = (search?: string) =>
    useQuery({
      ...wineOptionsQueries.colors(search),
      retry: 2,
      staleTime: 5 * 60 * 1000,
    })

  const fetchColors = useCallback(
    async (search?: string) => {
      return fetchWithErrorHandling(() => wineOptionsQueries.colors(search).queryFn())
    },
    [fetchWithErrorHandling]
  )

  const useWineTypes = () =>
    useQuery({
      ...wineTypeQueries.list(),
      retry: 2,
      staleTime: 5 * 60 * 1000,
    })

  const fetchWineTypes = useCallback(
    async (search?: string) => {
      return fetchWithErrorHandling(() => wineOptionsQueries.types(search).queryFn())
    },
    [fetchWithErrorHandling]
  )

  return {
    useColors,
    useWineTypes,

    fetchColors,
    fetchWineTypes,
  }
}
