import { createStoreDevToolsWrapper } from '@/stores/creare-store-devtools-wrapper'
import { /*LevelItem,*/ WineTasteCharacteristics } from './types/taste-characteristics'

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

  // updateCharacteristicLevels: (characteristicId: string, levels: LevelItem[]) => void
  // addCharacteristicLevel: (characteristicId: string, level: LevelItem) => void
  // updateCharacteristicLevel: (characteristicId: string, levelId: string, updatedLevel: LevelItem) => void
  // deleteCharacteristicLevel: (characteristicId: string, levelId: string) => void
  // reorderCharacteristicLevels: (characteristicId: string, levelIds: string[]) => void

  // getTasteCharacteristicById: (id: string) => WineTasteCharacteristics | undefined
  // getTasteCharacteristicByLabel: (label: string) => WineTasteCharacteristics | undefined
  // hasTasteCharacteristic: (id: string) => boolean
  // hasTasteCharacteristicByLabel: (label: string) => boolean
}

export const useWineTasteCharacteristicsStore = createStoreDevToolsWrapper<WineTasteCharacteristicsStoreState>(
  set => ({
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

    searchTasteCharacteristics: searchTerm =>
      set(
        (state: WineTasteCharacteristicsStoreState) => ({
          searchResults: state.tasteCharacteristics.filter(
            c =>
              c.nameUa.toLowerCase().includes(searchTerm.toLowerCase()) ||
              c.nameEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              c.levels?.some(level => level.nameUa.toLowerCase().includes(searchTerm.toLowerCase()))
          ),
        }),
        false,
        'tasteCharacteristics/searchTasteCharacteristics'
      ),

    clearSearch: () => set({ searchResults: [] }, false, 'tasteCharacteristics/clearSearch'),

    // updateCharacteristicLevels: (characteristicId, levels) =>
    //   set(
    //     (state: WineTasteCharacteristicsStoreState) => ({
    //       tasteCharacteristics: state.tasteCharacteristics.map(c =>
    //         c.id === characteristicId
    //           ? {
    //               ...c,
    //               levels: levels,
    //             }
    //           : c
    //       ),
    //     }),
    //     false,
    //     'tasteCharacteristics/updateCharacteristicLevels'
    //   ),

    // addCharacteristicLevel: (characteristicId, level) =>
    //   set(
    //     (state: WineTasteCharacteristicsStoreState) => ({
    //       tasteCharacteristics: state.tasteCharacteristics.map(c =>
    //         c.id === characteristicId
    //           ? {
    //               ...c,
    //               levels: [...(c.levels || []), level],
    //             }
    //           : c
    //       ),
    //     }),
    //     false,
    //     'tasteCharacteristics/addCharacteristicLevel'
    //   ),

    // updateCharacteristicLevel: (characteristicId, levelId, updatedLevel) =>
    //   set(
    //     (state: WineTasteCharacteristicsStoreState) => ({
    //       tasteCharacteristics: state.tasteCharacteristics.map(c =>
    //         c.id === characteristicId
    //           ? {
    //               ...c,
    //               levels: c.levels?.map(l => (l.id === levelId ? updatedLevel : l)) || [],
    //             }
    //           : c
    //       ),
    //     }),
    //     false,
    //     'tasteCharacteristics/updateCharacteristicLevel'
    //   ),

    // deleteCharacteristicLevel: (characteristicId, levelId) =>
    //   set(
    //     (state: WineTasteCharacteristicsStoreState) => ({
    //       tasteCharacteristics: state.tasteCharacteristics.map(c =>
    //         c.id === characteristicId
    //           ? {
    //               ...c,
    //               levels: c.levels?.filter(l => l.id !== levelId) || [],
    //             }
    //           : c
    //       ),
    //     }),
    //     false,
    //     'tasteCharacteristics/deleteCharacteristicLevel'
    //   ),

    // reorderCharacteristicLevels: (characteristicId, levelIds) =>
    //   set(
    //     (state: WineTasteCharacteristicsStoreState) => {
    //       const characteristic = state.tasteCharacteristics.find(c => c.id === characteristicId)

    //       if (!characteristic?.levels) return state

    //       const levelMap = new Map(characteristic.levels.map(l => [l.id, l]))
    //       const reorderedLevels = levelIds.map(id => levelMap.get(id)).filter(Boolean) as LevelItem[]
    //       const levelsWithUpdatedOrder = reorderedLevels.map((level, index) => ({
    //         ...level,
    //         order: index,
    //       }))

    //       return {
    //         tasteCharacteristics: state.tasteCharacteristics.map(c =>
    //           c.id === characteristicId
    //             ? {
    //                 ...c,
    //                 levels: levelsWithUpdatedOrder,
    //               }
    //             : c
    //         ),
    //       }
    //     },
    //     false,
    //     'tasteCharacteristics/reorderCharacteristicLevels'
    //   ),

    // getTasteCharacteristicById: id => {
    //   return get().tasteCharacteristics.find((c: WineTasteCharacteristics) => c.id === id)
    // },

    // getTasteCharacteristicByLabel: label => {
    //   return get().tasteCharacteristics.find((c: WineTasteCharacteristics) => c.label === label)
    // },

    // hasTasteCharacteristic: id => {
    //   return get().tasteCharacteristics.some((c: WineTasteCharacteristics) => c.id === id)
    // },

    // hasTasteCharacteristicByLabel: label => {
    //   return get().tasteCharacteristics.some((c: WineTasteCharacteristics) => c.label === label)
    // },
  }),
  'WineTasteStore'
)
