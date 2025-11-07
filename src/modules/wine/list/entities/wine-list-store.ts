import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'
import { createStoreDevToolsWrapper } from '@/stores/creare-store-devtools-wrapper'
import { IWines } from './types/types'

interface WineState {
  wines: IWines[]
  searchResults: IWines[]
  currentWine: IWines | null
  filters: {
    search: string
    limit: number
    offset: number
  }
  setWines: (wines: IWines[]) => void
  setSearchResults: (results: IWines[]) => void
  setCurrentWine: (wine: IWines | null) => void
  setFilters: (filters: Partial<WineState['filters']>) => void
  resetFilters: () => void
  updateWine: (wineId: string, newWine: IWines) => void
}

export const useWineStore = createStoreDevToolsWrapper<WineState>(
  set => ({
    wines: [],
    searchResults: [],
    currentWine: null,

    filters: {
      search: '',
      limit: DEFAULT_PAGINATION_LIMIT,
      offset: 0,
    },

    setWines: (wines: IWines[]) => set({ wines }, false, 'wine/setWines'),

    setSearchResults: (results: IWines[]) => set({ searchResults: results }, false, 'wine/setSearchResults'),

    setCurrentWine: (wine: IWines | null) => set({ currentWine: wine }, false, 'wine/setCurrentWine'),

    setFilters: (newFilters: Partial<WineState['filters']>) =>
      set(
        (state: WineState) => ({
          filters: { ...state.filters, ...newFilters },
        }),
        false,
        'wine/setFilters'
      ),

    resetFilters: () =>
      set(
        {
          filters: {
            search: '',
            limit: DEFAULT_PAGINATION_LIMIT,
            offset: 0,
          },
        },
        false,
        'wine/resetFilters'
      ),

    updateWine: (wineId: string, newWine: IWines) =>
      set(
        (state: WineState) => ({
          wines: state.wines.map(w => (w.id === wineId ? newWine : w)),
          currentWine: state.currentWine?.id === wineId ? newWine : state.currentWine,
          searchResults: state.searchResults.map(w => (w.id === wineId ? newWine : w)),
        }),
        false,
        'wine/updateWine'
      ),
  }),
  'WineStore'
)
