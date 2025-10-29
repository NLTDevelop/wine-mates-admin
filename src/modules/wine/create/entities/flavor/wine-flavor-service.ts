import { WineOption } from '../types'
import { CreateFlavorParams, UpdateFlavorParams } from '../types/flavor'

const WINE_FLAVORS_KEY = 'wine-flavors'

const localStorageApi = {
  get: (key: string): WineOption[] => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return []
    }
  },

  set: (key: string, data: WineOption[]): void => {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error('Error writing to localStorage:', error)
    }
  },
}

// Мок
const initialFlavors: WineOption[] = [
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

export const wineFlavorService = {
  list: async (): Promise<WineOption[]> => {
    const flavors = localStorageApi.get(WINE_FLAVORS_KEY)
    if (flavors.length === 0) {
      localStorageApi.set(WINE_FLAVORS_KEY, initialFlavors)
      return initialFlavors
    }
    return flavors
  },

  create: async (flavor: CreateFlavorParams): Promise<WineOption[]> => {
    const flavors = localStorageApi.get(WINE_FLAVORS_KEY)
    const isDuplicate = flavors.some(f => f.value === flavor.value || f.label.toLowerCase() === flavor.label.toLowerCase())

    if (isDuplicate) {
      throw new Error('Такой вкус уже существует')
    }

    const newFlavor: WineOption = {
      value: flavor.value,
      label: flavor.label,
      items: flavor.items || [],
      colorLabel: flavor.colorLabel,
      tones: flavor.tones,
    }

    const updated = [...flavors, newFlavor]
    localStorageApi.set(WINE_FLAVORS_KEY, updated)
    return updated
  },

  update: async (params: UpdateFlavorParams): Promise<WineOption[]> => {
    const flavors = localStorageApi.get(WINE_FLAVORS_KEY)
    const updated = flavors.map(flavor => (flavor.value === params.oldValue ? params.newFlavor : flavor))
    localStorageApi.set(WINE_FLAVORS_KEY, updated)
    return updated
  },

  delete: async (flavorValue: string): Promise<WineOption[]> => {
    const flavors = localStorageApi.get(WINE_FLAVORS_KEY)
    const updated = flavors.filter(f => f.value !== flavorValue)
    localStorageApi.set(WINE_FLAVORS_KEY, updated)
    return updated
  },
}
