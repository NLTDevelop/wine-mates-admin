import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { WineOption } from '../entities/types'

const WINE_SMELLS_KEY = 'wine-smells'

export const useWineSmells = () => {
  const queryClient = useQueryClient()

  const { data: smells = [], isLoading } = useQuery<WineOption[]>({
    queryKey: [WINE_SMELLS_KEY],
    queryFn: async () => {
      const stored = localStorage.getItem(WINE_SMELLS_KEY)
      return stored ? JSON.parse(stored) : []
    },
  })

  const addSmell = useMutation({
    mutationFn: async (smell: WineOption) => {
      const updated = [...smells, smell]
      localStorage.setItem(WINE_SMELLS_KEY, JSON.stringify(updated))
      return updated
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WINE_SMELLS_KEY] })
    },
  })

  const removeSmell = useMutation({
    mutationFn: async (smellValue: string) => {
      const updated = smells.filter(s => s.value !== smellValue)
      localStorage.setItem(WINE_SMELLS_KEY, JSON.stringify(updated))
      return updated
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WINE_SMELLS_KEY] })
    },
  })

  return {
    smells,
    isLoading,
    addSmell: addSmell.mutate,
    removeSmell: removeSmell.mutate,
  }
}
