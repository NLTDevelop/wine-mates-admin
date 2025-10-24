import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { WineOption } from '../entities/types'

const WINE_FLAVORS_KEY = 'wine-flavors'

export const useWineFlavors = () => {
  const queryClient = useQueryClient()

  const { data: flavors = [], isLoading } = useQuery<WineOption[]>({
    queryKey: [WINE_FLAVORS_KEY],
    queryFn: async () => {
      try {
        const stored = localStorage.getItem(WINE_FLAVORS_KEY)
        if (stored) {
          return JSON.parse(stored)
        }

        return [
          {
            value: '#DC143C',
            label: 'Фруктовый',
            items: ['Вишня', 'Малина', 'Клубника', 'Гранат'],
          },
          {
            value: '#8B4513',
            label: 'Пряный',
            items: ['Корица', 'Ваниль', 'Перец', 'Гвоздика'],
          },
          {
            value: '#FFD700',
            label: 'Цитрусовый',
            items: ['Лимон', 'Лайм', 'Апельсин', 'Грейпфрут'],
          },
        ]
      } catch (error) {
        console.error('Error loading wine flavors:', error)
        return []
      }
    },
  })

  const addFlavor = useMutation({
    mutationFn: async (flavor: WineOption) => {
      // Проверяем на дубликаты (по значению и label)
      const isDuplicate = flavors.some(f => f.value === flavor.value || f.label.toLowerCase() === flavor.label.toLowerCase())

      if (isDuplicate) {
        throw new Error('Такой вкус уже существует')
      }

      const updated = [...flavors, flavor]
      localStorage.setItem(WINE_FLAVORS_KEY, JSON.stringify(updated))
      return updated
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WINE_FLAVORS_KEY] })
    },
    onError: error => {
      console.error('Error adding flavor:', error)
    },
  })

  const updateFlavor = useMutation({
    mutationFn: async ({ oldValue, newFlavor }: { oldValue: string; newFlavor: WineOption }) => {
      const updated = flavors.map(flavor => (flavor.value === oldValue ? newFlavor : flavor))
      localStorage.setItem(WINE_FLAVORS_KEY, JSON.stringify(updated))
      return updated
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WINE_FLAVORS_KEY] })
    },
  })

  const removeFlavor = useMutation({
    mutationFn: async (flavorValue: string) => {
      const updated = flavors.filter(f => f.value !== flavorValue)
      localStorage.setItem(WINE_FLAVORS_KEY, JSON.stringify(updated))
      return updated
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WINE_FLAVORS_KEY] })
    },
  })

  const getFlavorByValue = (value: string) => {
    return flavors.find(flavor => flavor.value === value)
  }

  const searchFlavors = (searchTerm: string) => {
    return flavors.filter(flavor => flavor.label.toLowerCase().includes(searchTerm.toLowerCase()) || flavor.items?.some(item => item.toLowerCase().includes(searchTerm.toLowerCase())))
  }

  return {
    flavors,
    isLoading: isLoading || addFlavor.isPending || removeFlavor.isPending,
    addFlavor: addFlavor.mutate,
    updateFlavor: updateFlavor.mutate,
    removeFlavor: removeFlavor.mutate,
    getFlavorByValue,
    searchFlavors,
    isAdding: addFlavor.isPending,
    isRemoving: removeFlavor.isPending,
    error: addFlavor.error,
  }
}
