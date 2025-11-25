import { createStoreDevToolsWrapper } from '@/stores/create-store-devtools-wrapper'
import { WineType } from './types/wine-type'
import { getDisplayNames } from '@/lib/utils'

interface WineTypeStoreState {
  wineTypes: WineType[]
  searchResults: WineType[]
  currentWineType: WineType | null

  setWineTypes: (wineTypes: WineType[]) => void
  setCurrentWineType: (wineType: WineType | null) => void
  addWineType: (wineType: WineType) => void
  updateWineType: (wineTypeValue: string, updatedWineType: Partial<WineType>) => void
  deleteWineType: (wineTypeValue: string) => void
  searchWineType: (searchTerm: string) => void
  clearSearch: () => void

  getWineTypeById: (value: string) => WineType | undefined
  hasWineType: (value: string) => boolean
}

export const useWineTypeStore = createStoreDevToolsWrapper<WineTypeStoreState>((set, get) => ({
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

  updateWineType: (wineTypeValue, updatedWineType) =>
    set(
      (state: WineTypeStoreState) => ({
        wineTypes: state.wineTypes.map(wt => (wt.id === wineTypeValue ? { ...wt, ...updatedWineType } : wt)),
      }),
      false,
      'wineTypes/updateWineType'
    ),

  deleteWineType: wineTypeValue =>
    set(
      (state: WineTypeStoreState) => ({
        wineTypes: state.wineTypes.filter(wt => wt.id !== wineTypeValue),
      }),
      false,
      'wineTypes/deleteWineType'
    ),

  searchWineType: searchTerm => {
    const { wineTypes } = get()
    if (!searchTerm.trim()) {
      set({ searchResults: [] }, false, 'wineTypes/searchWineType')
      return
    }

    const searchTermLower = searchTerm.toLowerCase()

    const filtered = wineTypes.filter((wt: WineType) => {
      const { nameUa: groupNameUa, nameEn: groupNameEn } = getDisplayNames(wt.translations)

      return groupNameUa.toLowerCase().includes(searchTermLower) || (groupNameEn && groupNameEn.toLowerCase().includes(searchTermLower))
    })

    set({ searchResults: filtered }, false, 'wineTypes/searchWineType')
  },

  clearSearch: () => set({ searchResults: [] }, false, 'wineTypes/clearSearch'),

  getWineTypeById: id => {
    return get().wineTypes.find((wt: WineType) => wt.id === id)
  },

  hasWineType: id => {
    return get().wineTypes.some((wt: WineType) => wt.id === id)
  },
}))
