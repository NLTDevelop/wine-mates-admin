import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/shadcn/use-toast'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { wineryWineListQueries } from '../entities/wine-list-queries'
import { useAddWinesStore } from '../entities/wine-list-store'
import { WineryWineOfferPayload } from '../entities/types'

export const useAddWineToWinery = () => {
  const { toast } = useToast()
  const { t } = useTranslation('winery')
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()

  const { selectedWines, setSelectedWines, resetEmptyWineryFilters } = useAddWinesStore()

  const addWineMutation = useMutation({
    ...wineryWineListQueries.addWine(),
    onSuccess: (_, variables) => {
      const count = variables.length
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

  const addWines = async (offerData: WineryWineOfferPayload) => {
    const wineryId = Number(id)

    if (!wineryId || Number.isNaN(wineryId)) {
      toast({ title: t('offer.winery_id_missing'), variant: 'destructive' })
      return false
    }

    if (!selectedWines || selectedWines.length === 0) return false

    const wineIds = selectedWines.map(wine => Number(wine.id)).filter(wineId => !Number.isNaN(wineId))

    if (wineIds.length === 0) {
      toast({ title: t('offer.wine_id_missing'), variant: 'destructive' })
      return false
    }

    const offers = wineIds.map(wineId => ({
      wineryId,
      wineId,
      ...offerData,
    }))

    await addWineMutation.mutateAsync(offers)
    return true
  }

  return {
    addWines,
    isAdding: addWineMutation.isPending,
    selectedWines,
  }
}
