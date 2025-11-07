import { createStoreDevToolsWrapper } from '@/stores/creare-store-devtools-wrapper'
import { WineColor, WineColorItem } from './types/color'

interface ColorStoreState {
  colors: WineColor[]
  searchResults: WineColor[]
  currentColor: WineColor | null
  shades: WineColor[]

  setColors: (colors: WineColor[]) => void
  setCurrentColor: (color: WineColor | null) => void
  addColor: (color: WineColor) => void
  updateColor: (colorId: string, newColor: WineColor) => void
  deleteColor: (colorId: string) => void
  searchColors: (searchTerm: string) => void
  clearSearch: () => void

  setShades: (shades: WineColor[]) => void
  addShade: (colorId: string, item: WineColorItem) => void
  updateShade: (colorId: string, updatedItem: WineColorItem) => void
  deleteShade: (shadeId: string) => void

  getColorById: (id: string) => WineColor | undefined
  getColorByValue: (value: string) => WineColor | undefined
  hasColor: (id: string) => boolean
  hasColorByValue: (value: string) => boolean
  getShadeById: (id: string) => WineColor | undefined
  reorderShades: (colorId: string, shades: WineColorItem[]) => void
}

export const useColorStore = createStoreDevToolsWrapper<ColorStoreState>(
  (set, get) => ({
    colors: [],
    searchResults: [],
    currentColor: null,
    shades: [],

    setColors: colors => set({ colors }, false, 'colors/setColors'),

    setCurrentColor: color => set({ currentColor: color }, false, 'colors/setCurrentColor'),

    addColor: color =>
      set(
        (state: ColorStoreState) => ({
          colors: [...state.colors, color],
        }),
        false,
        'colors/addColor'
      ),

    updateColor: (colorId, newColor) =>
      set(
        (state: ColorStoreState) => ({
          colors: state.colors.map(c => (c.id === colorId ? newColor : c)),
          currentColor: state.currentColor?.id === colorId ? newColor : state.currentColor,
          searchResults: state.searchResults.map(c => (c.id === colorId ? newColor : c)),
        }),
        false,
        'colors/updateColor'
      ),

    deleteColor: colorId =>
      set(
        (state: ColorStoreState) => ({
          colors: state.colors.filter(c => c.id !== colorId),
          currentColor: state.currentColor?.id === colorId ? null : state.currentColor,
          searchResults: state.searchResults.filter(c => c.id !== colorId),
        }),
        false,
        'colors/deleteColor'
      ),

    searchColors: searchTerm =>
      set(
        (state: ColorStoreState) => ({
          searchResults: state.colors.filter(
            c => c.label.toLowerCase().includes(searchTerm.toLowerCase()) || c.labelEn?.toLowerCase().includes(searchTerm.toLowerCase()) || c.value.toLowerCase().includes(searchTerm.toLowerCase())
          ),
        }),
        false,
        'colors/searchColors'
      ),

    clearSearch: () => set({ searchResults: [] }, false, 'colors/clearSearch'),

    setShades: shades => set({ shades }, false, 'colors/setShades'),

    addShade: (colorId: string, item: WineColorItem) =>
      set(
        (state: ColorStoreState) => ({
          colors: state.colors.map(color =>
            color.id === colorId
              ? {
                  ...color,
                  items: [...(color.items || []), item],
                }
              : color
          ),
          shades: [...state.shades, item],
        }),
        false,
        'colors/addShade'
      ),

    updateShade: (colorId: string, updatedItem: WineColorItem) =>
      set(
        (state: ColorStoreState) => ({
          colors: state.colors.map(color =>
            color.id === colorId
              ? {
                  ...color,
                  items: color.items?.map(item => (item.id === updatedItem.id ? updatedItem : item)) || [],
                }
              : color
          ),
        }),
        false,
        'colors/updateShade'
      ),

    reorderShades: (colorId: string, shades: WineColorItem[]) =>
      set(
        (state: ColorStoreState) => ({
          colors: state.colors.map(color => (color.id === colorId ? { ...color, items: shades } : color)),
        }),
        false,
        'colors/reorderShades'
      ),

    deleteShade: shadeId =>
      set(
        (state: ColorStoreState) => ({
          shades: state.shades.filter(s => s.id !== shadeId),
        }),
        false,
        'colors/deleteShade'
      ),

    getColorById: id => {
      return get().colors.find((c: WineColor) => c.id === id)
    },

    getColorByValue: value => {
      return get().colors.find((c: WineColor) => c.value === value)
    },

    hasColor: id => {
      return get().colors.some((c: WineColor) => c.id === id)
    },

    hasColorByValue: value => {
      return get().colors.some((c: WineColor) => c.value === value)
    },

    getShadeById: id => {
      return get().shades.find((s: WineColor) => s.id === id)
    },
  }),
  'ColorStore'
)
