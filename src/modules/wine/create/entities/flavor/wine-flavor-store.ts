import { createStoreDevToolsWrapper } from '@/stores/creare-store-devtools-wrapper'
import { WineOption } from '../types'

interface WineFlavorStoreState {
  flavors: WineOption[]
  searchResults: WineOption[]
  currentFlavor: WineOption | null

  setFlavors: (flavors: WineOption[]) => void
  setCurrentFlavor: (flavor: WineOption | null) => void
  addFlavor: (flavor: WineOption) => void
  updateFlavor: (oldValue: string, newFlavor: WineOption) => void
  deleteFlavor: (flavorValue: string) => void
  searchFlavors: (searchTerm: string) => void
  clearSearch: () => void

  getFlavorByValue: (value: string) => WineOption | undefined
  hasFlavor: (value: string) => boolean
}

export const useWineFlavorStore = createStoreDevToolsWrapper<WineFlavorStoreState>(
  (set, get) => ({
    flavors: [],
    searchResults: [],
    currentFlavor: null,

    setFlavors: flavors => set({ flavors }, false, 'wineFlavors/setFlavors'),

    setCurrentFlavor: flavor => set({ currentFlavor: flavor }, false, 'wineFlavors/setCurrentFlavor'),

    addFlavor: flavor =>
      set(
        (state: WineFlavorStoreState) => ({
          flavors: [...state.flavors, flavor],
        }),
        false,
        'wineFlavors/addFlavor'
      ),

    updateFlavor: (oldValue, newFlavor) =>
      set(
        (state: WineFlavorStoreState) => ({
          flavors: state.flavors.map(flavor => (flavor.value === oldValue ? newFlavor : flavor)),
          currentFlavor: state.currentFlavor?.value === oldValue ? newFlavor : state.currentFlavor,
          searchResults: state.searchResults.map(flavor => (flavor.value === oldValue ? newFlavor : flavor)),
        }),
        false,
        'wineFlavors/updateFlavor'
      ),

    deleteFlavor: flavorValue =>
      set(
        (state: WineFlavorStoreState) => ({
          flavors: state.flavors.filter(flavor => flavor.value !== flavorValue),
          currentFlavor: state.currentFlavor?.value === flavorValue ? null : state.currentFlavor,
          searchResults: state.searchResults.filter(flavor => flavor.value !== flavorValue),
        }),
        false,
        'wineFlavors/deleteFlavor'
      ),

    searchFlavors: searchTerm =>
      set(
        (state: WineFlavorStoreState) => ({
          searchResults: state.flavors.filter(
            flavor => flavor.label.toLowerCase().includes(searchTerm.toLowerCase()) || flavor.items?.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
          ),
        }),
        false,
        'wineFlavors/searchFlavors'
      ),

    clearSearch: () => set({ searchResults: [] }, false, 'wineFlavors/clearSearch'),

    getFlavorByValue: value => {
      return get().flavors.find((flavor: WineOption) => flavor.value === value)
    },

    hasFlavor: value => {
      return get().flavors.some((flavor: WineOption) => flavor.value === value)
    },
  }),
  'WineFlavorStore'
)
