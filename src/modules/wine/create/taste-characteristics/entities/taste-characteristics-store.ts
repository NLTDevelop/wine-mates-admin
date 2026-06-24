import { createStoreDevToolsWrapper } from '@/stores/create-store-devtools-wrapper'
import { getDisplayNameDescription } from '@/lib/utils'
import { WineTasteCharacteristics } from './taste-characteristics'
import { ReorderItem } from '../../general/entities/types'

interface WineTasteCharacteristicsStoreState {
  tasteCharacteristics: WineTasteCharacteristics[]
  searchResults: WineTasteCharacteristics[]
  currentTasteCharacteristic: WineTasteCharacteristics | null

  setTasteCharacteristics: (characteristics: WineTasteCharacteristics[]) => void
  setCurrentTasteCharacteristic: (characteristic: WineTasteCharacteristics | null) => void
  addTasteCharacteristic: (characteristic: WineTasteCharacteristics) => void
  updateTasteCharacteristic: (characteristicId: string, newCharacteristic: WineTasteCharacteristics) => void
  deleteTasteCharacteristic: (characteristicId: string) => void
  searchTasteCharacteristics: (searchTerm: string) => void
  clearSearch: () => void
  reorderTasteCharacteristics: (items: ReorderItem[]) => void
}

export const useWineTasteCharacteristicsStore = createStoreDevToolsWrapper<WineTasteCharacteristicsStoreState>(
  (set, get) => ({
    tasteCharacteristics: [],
    searchResults: [],
    currentTasteCharacteristic: null,

    setTasteCharacteristics: characteristics => set({ tasteCharacteristics: characteristics }, false, 'tasteCharacteristics/setTasteCharacteristics'),

    setCurrentTasteCharacteristic: characteristic => set({ currentTasteCharacteristic: characteristic }, false, 'tasteCharacteristics/setCurrentTasteCharacteristic'),

    addTasteCharacteristic: characteristic =>
      set(
        (state: WineTasteCharacteristicsStoreState) => ({
          tasteCharacteristics: [...state.tasteCharacteristics, characteristic],
        }),
        false,
        'tasteCharacteristics/addTasteCharacteristic'
      ),

    updateTasteCharacteristic: (characteristicId, newCharacteristic) =>
      set(
        (state: WineTasteCharacteristicsStoreState) => ({
          tasteCharacteristics: state.tasteCharacteristics.map(c => (c.id === characteristicId ? newCharacteristic : c)),
          currentTasteCharacteristic: state.currentTasteCharacteristic?.id === characteristicId ? newCharacteristic : state.currentTasteCharacteristic,
          searchResults: state.searchResults.map(c => (c.id === characteristicId ? newCharacteristic : c)),
        }),
        false,
        'tasteCharacteristics/updateTasteCharacteristic'
      ),

    deleteTasteCharacteristic: characteristicId =>
      set(
        (state: WineTasteCharacteristicsStoreState) => ({
          tasteCharacteristics: state.tasteCharacteristics.filter(c => c.id !== characteristicId),
          currentTasteCharacteristic: state.currentTasteCharacteristic?.id === characteristicId ? null : state.currentTasteCharacteristic,
          searchResults: state.searchResults.filter(c => c.id !== characteristicId),
        }),
        false,
        'tasteCharacteristics/deleteTasteCharacteristic'
      ),

    searchTasteCharacteristics: searchTerm => {
      const { tasteCharacteristics } = get()
      if (!searchTerm.trim()) {
        set({ searchResults: [] }, false, 'tasteCharacteristics/searchTasteCharacteristics')
        return
      }

      const searchTermLower = searchTerm.toLowerCase()

      const filtered = tasteCharacteristics.filter((tc: WineTasteCharacteristics) => {
        const { nameUa: groupNameUa, nameEn: groupNameEn } = getDisplayNameDescription(tc.translations || [])

        return groupNameUa.toLowerCase().includes(searchTermLower) || (groupNameEn && groupNameEn.toLowerCase().includes(searchTermLower))
      })

      set({ searchResults: filtered }, false, 'tasteCharacteristics/searchTasteCharacteristics')
    },

    clearSearch: () => set({ searchResults: [] }, false, 'tasteCharacteristics/clearSearch'),

    reorderTasteCharacteristics: (items: ReorderItem[]) =>
      set(
        (state: WineTasteCharacteristicsStoreState) => {
          const sortMap = new Map(items.map(item => [item.id, item.sortNumber]))

          return {
            aromaGroups: state.tasteCharacteristics
              .map(group => {
                const newSortNumber = sortMap.get(Number(group.id))
                return newSortNumber !== undefined ? { ...group, sortNumber: newSortNumber } : group
              })
              .sort((a, b) => a.sortNumber - b.sortNumber),
          }
        },
        false,
        'tasteCharacteristics/reorderGroups'
      ),
  }),
  'WineTasteCharacteristicsStore'
)
