import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { WineOption } from '../entities/types'

const WINE_COLORS_KEY = 'wine-colors'

export const useWineColors = () => {
  const queryClient = useQueryClient()

  const { data: colors = [], isLoading } = useQuery<WineOption[]>({
    queryKey: [WINE_COLORS_KEY],
    queryFn: async () => {
      const stored = localStorage.getItem(WINE_COLORS_KEY)
      return stored ? JSON.parse(stored) : []
    }
  })

  const addColor = useMutation({
    mutationFn: async (color: WineOption) => {
      const updated = [...colors, color]
      localStorage.setItem(WINE_COLORS_KEY, JSON.stringify(updated))
      return updated
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WINE_COLORS_KEY] })
    }
  })

  const removeColor = useMutation({
    mutationFn: async (colorValue: string) => {
      const updated = colors.filter(c => c.value !== colorValue)
      localStorage.setItem(WINE_COLORS_KEY, JSON.stringify(updated))
      return updated
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WINE_COLORS_KEY] })
    }
  })

  return {
    colors,
    isLoading,
    addColor: addColor.mutate,
    removeColor: removeColor.mutate
  }
}