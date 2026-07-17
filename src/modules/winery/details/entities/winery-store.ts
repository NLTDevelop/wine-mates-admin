import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'
import { createStoreDevToolsWrapper } from '@/stores/create-store-devtools-wrapper'
import { IWinery } from '../../list/entities/types'
import { ListWineFilters } from './types'

interface WineListOfWineryState {
  searchResults: IWinery[]
  filters: ListWineFilters
  setSearchResults: (results: IWinery[]) => void
  setFilters: (filters: Partial<WineListOfWineryState['filters']>) => void
  resetFilters: () => void
}

export const useWineListOfWineryStore = createStoreDevToolsWrapper<WineListOfWineryState>(
  set => ({
    searchResults: [],

    filters: {
      search: '',
      limit: DEFAULT_PAGINATION_LIMIT,
      page: 1,
    },

    setSearchResults: (results: IWinery[]) => set({ searchResults: results }, false, 'wineListOfWinery/setSearchResults'),

    setFilters: (newFilters: Partial<WineListOfWineryState['filters']>) =>
      set(
        (state: WineListOfWineryState) => ({
          filters: { ...state.filters, ...newFilters },
        }),
        false,
        'wineListOfWinery/setFilters'
      ),

    resetFilters: () =>
      set(
        {
          filters: {
            search: '',
            limit: DEFAULT_PAGINATION_LIMIT,
            page: 1,
          },
        },
        false,
        'wineListOfWinery/resetFilters'
      ),
  }),

  'WineListOfWineryStore'
)
