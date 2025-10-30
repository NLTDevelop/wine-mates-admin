import { useCallback } from 'react'
import { mockAromas, mockColors, mockFlavorCharacteristics, mockFlavorNotes } from '../entities/mock'
import { useQuery } from '@tanstack/react-query'
import { wineOptionsQueries } from '../entities/wine-options-queries'

//для мок
export const useWineOptionsMock = () => {
  const fetchColors = useCallback(async (search?: string) => {
    return mockColors.filter(color => !search || color.label.toLowerCase().includes(search.toLowerCase()))
  }, [])

  const fetchAromas = useCallback(async (search?: string) => {
    return mockAromas.filter(aroma => !search || aroma.label.toLowerCase().includes(search.toLowerCase()))
  }, [])

  const fetchFlavorNotes = useCallback(async (search?: string) => {
    return mockFlavorNotes.filter(note => !search || note.label.toLowerCase().includes(search.toLowerCase()))
  }, [])

  const fetchFlavorCharacteristics = useCallback(async (search?: string) => {
    return mockFlavorCharacteristics.filter(char => !search || char.label.toLowerCase().includes(search.toLowerCase()))
  }, [])

  return {
    fetchColors,
    fetchAromas,
    fetchFlavorNotes,
    fetchFlavorCharacteristics,
  }
}

// -----------------------------------------------------------------------------

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

  const useAromas = (search?: string) =>
    useQuery({
      ...wineOptionsQueries.aromas(search),
      retry: 2,
      staleTime: 5 * 60 * 1000,
    })

  const fetchColors = useCallback(
    async (search?: string) => {
      return fetchWithErrorHandling(() => wineOptionsQueries.colors(search).queryFn())
    },
    [fetchWithErrorHandling]
  )

  const fetchAromas = useCallback(
    async (search?: string) => {
      return fetchWithErrorHandling(() => wineOptionsQueries.aromas(search).queryFn())
    },
    [fetchWithErrorHandling]
  )

  const fetchFlavorNotes = useCallback(
    async (search?: string) => {
      return fetchWithErrorHandling(() => wineOptionsQueries.flavorNotes(search).queryFn())
    },
    [fetchWithErrorHandling]
  )

  const fetchFlavorCharacteristics = useCallback(
    async (search?: string) => {
      return fetchWithErrorHandling(() => wineOptionsQueries.flavorCharacteristics(search).queryFn())
    },
    [fetchWithErrorHandling]
  )

  return {
    useColors,
    useAromas,
    useFlavorNotes: (search?: string) =>
      useQuery({
        ...wineOptionsQueries.flavorNotes(search),
        retry: 2,
        staleTime: 5 * 60 * 1000,
      }),
    useFlavorCharacteristics: (search?: string) =>
      useQuery({
        ...wineOptionsQueries.flavorCharacteristics(search),
        retry: 2,
        staleTime: 5 * 60 * 1000,
      }),

    fetchColors,
    fetchAromas,
    fetchFlavorNotes,
    fetchFlavorCharacteristics,
  }
}
