import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { wineFlavorQueries } from '../entities/flavor/wine-flavor-queries'
import { WineOption } from '../entities/types'

export const useWineFlavors = () => {
  const queryClient = useQueryClient()

  const { data: flavors = [], isLoading } = useQuery(wineFlavorQueries.list())

  const createMutation = useMutation(wineFlavorQueries.create())

  const updateMutation = useMutation(wineFlavorQueries.update())

  const deleteMutation = useMutation(wineFlavorQueries.delete())

  const addFlavor = (flavor: WineOption) => {
    createMutation.mutate(flavor, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['wine-flavors', 'list'] })
      },
      onError: error => {
        console.error('Error adding flavor:', error)
      },
    })
  }

  const updateFlavor = (oldValue: string, newFlavor: WineOption) => {
    updateMutation.mutate(
      { oldValue, newFlavor },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['wine-flavors', 'list'] })
        },
      }
    )
  }

  const removeFlavor = (flavorValue: string) => {
    deleteMutation.mutate(flavorValue, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['wine-flavors', 'list'] })
      },
    })
  }

  const getFlavorByValue = (value: string) => {
    return flavors.find(flavor => flavor.value === value)
  }

  const searchFlavors = (searchTerm: string) => {
    return flavors.filter(flavor => flavor.label.toLowerCase().includes(searchTerm.toLowerCase()) || flavor.items?.some(item => item.toLowerCase().includes(searchTerm.toLowerCase())))
  }

  return {
    flavors,
    isLoading: isLoading || createMutation.isPending || deleteMutation.isPending,
    addFlavor,
    updateFlavor,
    removeFlavor,
    getFlavorByValue,
    searchFlavors,
    isAdding: createMutation.isPending,
    isRemoving: deleteMutation.isPending,
    error: createMutation.error,
  }
}
