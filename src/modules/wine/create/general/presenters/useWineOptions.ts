import { useCallback } from 'react'
import { mockColors } from '../../wine-types/entities/mock'
import { useQuery } from '@tanstack/react-query'
import { wineOptionsQueries } from '../../wine-types/entities/wine-options-queries'

//для мок
export const useWineOptionsMock = () => {
  const fetchColors = useCallback(async (search?: string) => {
    return mockColors.filter(color => !search || color.nameUa.toLowerCase().includes(search.toLowerCase()))
  }, [])

  // const fetchAromas = useCallback(async (search?: string) => {
  //   return mockAromas.filter(aroma => !search || aroma.label.toLowerCase().includes(search.toLowerCase()))
  // }, [])

  // const fetchFlavorNotes = useCallback(async (search?: string) => {
  //   return mockFlavorNotes.filter(note => !search || note.label.toLowerCase().includes(search.toLowerCase()))
  // }, [])

  // const fetchFlavorCharacteristics = useCallback(async (search?: string) => {
  //   return mockFlavorCharacteristics.filter(char => !search || char.label.toLowerCase().includes(search.toLowerCase()))
  // }, [])

  return {
    fetchColors,
    // fetchAromas,
    // fetchFlavorNotes,
    // fetchFlavorCharacteristics,
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

  const fetchColors = useCallback(
    async (search?: string) => {
      return fetchWithErrorHandling(() => wineOptionsQueries.colors(search).queryFn())
    },
    [fetchWithErrorHandling]
  )

  return {
    useColors,
    fetchColors,
  }
}
