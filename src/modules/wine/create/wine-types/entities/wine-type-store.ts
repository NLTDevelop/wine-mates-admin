import { createStoreDevToolsWrapper } from '@/stores/creare-store-devtools-wrapper'
import { WineType } from './types/wine-type'

interface WineTypeStoreState {
  wineTypes: WineType[]
  searchResults: WineType[]
  currentWineType: WineType | null

  setWineTypes: (wineTypes: WineType[]) => void
  setCurrentWineType: (wineType: WineType | null) => void
  addWineType: (wineType: WineType) => void
  updateWineType: (oldValue: string, newWineType: WineType) => void
  deleteWineType: (wineTypeValue: string) => void
  searchWineType: (searchTerm: string) => void
  clearSearch: () => void

  getWineTypeById: (value: string) => WineType | undefined
  hasWineType: (value: string) => boolean
}

export const useWineTypeStore = createStoreDevToolsWrapper<WineTypeStoreState>(
  (set, get) => ({
    wineTypes: [],
    searchResults: [],
    currentWineType: null,

    setWineTypes: wineTypes => set({ wineTypes }, false, 'wineTypes/setWineTypes'),

    setCurrentWineType: wineType => set({ currentWineType: wineType }, false, 'wineTypes/setCurrentWineType'),

    addWineType: wineType =>
      set(
        (state: WineTypeStoreState) => ({
          wineTypes: [...state.wineTypes, wineType],
        }),
        false,
        'wineTypes/addWineType'
      ),

    updateWineType: (oldValue, newWineType) =>
      set(
        (state: WineTypeStoreState) => ({
          wineTypes: state.wineTypes.map(wt => (wt.id === oldValue ? newWineType : wt)),
          currentWineType: state.currentWineType?.id === oldValue ? newWineType : state.currentWineType,
          searchResults: state.searchResults.map(wt => (wt.id === oldValue ? newWineType : wt)),
        }),
        false,
        'wineTypes/updateWineType'
      ),

    deleteWineType: wineTypeValue =>
      set(
        (state: WineTypeStoreState) => ({
          wineTypes: state.wineTypes.filter(wt => wt.id !== wineTypeValue),
          currentWineType: state.currentWineType?.id === wineTypeValue ? null : state.currentWineType,
          searchResults: state.searchResults.filter(wt => wt.id !== wineTypeValue),
        }),
        false,
        'wineTypes/deleteWineType'
      ),

    searchWineType: searchTerm =>
      set(
        (state: WineTypeStoreState) => ({
          searchResults: state.wineTypes.filter(wt => wt.label.toLowerCase().includes(searchTerm.toLowerCase()) || wt.labelEn?.toLowerCase().includes(searchTerm.toLowerCase())),
        }),
        false,
        'wineTypes/searchWineTypes'
      ),

    clearSearch: () => set({ searchResults: [] }, false, 'wineTypes/clearSearch'),

    getWineTypeById: id => {
      return get().wineTypes.find((wt: WineType) => wt.id === id)
    },

    hasWineType: id => {
      return get().wineTypes.some((wt: WineType) => wt.id === id)
    },
  }),
  'WineTypeStore'
)
