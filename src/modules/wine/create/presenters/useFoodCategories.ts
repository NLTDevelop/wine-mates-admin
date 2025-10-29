import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const FOOD_CATEGORIES_KEY = 'food-categories'

export interface FoodCategoryData {
  value: string
  label: string
  items?: string[]
}

export const useFoodCategories = () => {
  const queryClient = useQueryClient()

  const { data: categories = [], isLoading } = useQuery<FoodCategoryData[]>({
    queryKey: [FOOD_CATEGORIES_KEY],
    queryFn: async () => {
      try {
        const stored = localStorage.getItem(FOOD_CATEGORIES_KEY)
        if (stored) {
          return JSON.parse(stored)
        }
        return [
          {
            value: '1',
            label: 'Морепродукты',
            items: ['Лосось', 'Креветка', 'Кальмар', 'Устрицы'],
          },
          {
            value: '2',
            label: 'Мясо',
            items: ['Говядина', 'Баранина', 'Свинина', 'Дичь'],
          },
          {
            value: '3',
            label: 'Сыры',
            items: ['Пармезан', 'Бри', 'Горгонзола', 'Чеддер'],
          },
          {
            value: '4',
            label: 'Десерты',
            items: ['Шоколад', 'Тирамису', 'Чизкейк', 'Фрукты'],
          },
        ]
      } catch (error) {
        console.error('Error loading food categories:', error)
        return []
      }
    },
  })

  const addCategory = useMutation({
    mutationFn: async (category: Omit<FoodCategoryData, 'value'>) => {
      const isDuplicate = categories.some(cat => cat.label.toLowerCase() === category.label.toLowerCase())

      if (isDuplicate) {
        throw new Error('Такая категория уже существует')
      }

      const newCategory: FoodCategoryData = {
        ...category,
        value: Date.now().toString(),
      }

      const updated = [...categories, newCategory]
      localStorage.setItem(FOOD_CATEGORIES_KEY, JSON.stringify(updated))
      return updated
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FOOD_CATEGORIES_KEY] })
    },
  })

  const removeCategory = useMutation({
    mutationFn: async (categoryValue: string) => {
      const updated = categories.filter(cat => cat.value !== categoryValue)
      localStorage.setItem(FOOD_CATEGORIES_KEY, JSON.stringify(updated))
      return updated
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FOOD_CATEGORIES_KEY] })
    },
  })

  const updateCategory = useMutation({
    mutationFn: async ({ value, updates }: { value: string; updates: Partial<FoodCategoryData> }) => {
      const updated = categories.map(cat => (cat.value === value ? { ...cat, ...updates } : cat))
      localStorage.setItem(FOOD_CATEGORIES_KEY, JSON.stringify(updated))
      return updated
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FOOD_CATEGORIES_KEY] })
    },
  })

  return {
    categories,
    isLoading: isLoading || addCategory.isPending || removeCategory.isPending,
    addCategory: addCategory.mutate,
    removeCategory: removeCategory.mutate,
    updateCategory: updateCategory.mutate,
    isAdding: addCategory.isPending,
    isRemoving: removeCategory.isPending,
  }
}
