import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/shadcn/use-toast'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { wineryWineListQueries } from '../entities/wine-list-queries'
import { useAddWinesStore } from '../entities/wine-list-store'

export const useAddWineToWinery = () => {
  const { toast } = useToast()
  const { t } = useTranslation('winery')
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()

  const { selectedWines, setSelectedWines, resetEmptyWineryFilters } = useAddWinesStore()

  const addWineMutation = useMutation({
    ...wineryWineListQueries.addWine(),
    onSuccess: (_, variables) => {
     const count = variables.wineIds.length
      toast({ title: t('wines_added', { count }), variant: 'success' })

      setSelectedWines([])
      resetEmptyWineryFilters()

      queryClient.invalidateQueries({ queryKey: ['wineryWineList', 'list'] })

      queryClient.invalidateQueries({ queryKey: ['wineryWineList', 'list-empty-winery'] })
    },
    onError: () => {
      toast({ title: t('error_adding_wines'), variant: 'destructive' })
    },
  })

  const addWines = async () => {
    if (!id) return

    if (!selectedWines || selectedWines.length === 0) return

    const wineIds = selectedWines.map(wine => wine.id).filter(id => typeof id === 'number' && !isNaN(id))

    await addWineMutation.mutateAsync({
      wineryId: parseInt(id),
      wineIds,
    })
    return true
  }

  return {
    addWines,
    isAdding: addWineMutation.isPending,
    selectedWines,
  }
}
