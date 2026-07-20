import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'
import { createStoreDevToolsWrapper } from '@/stores/create-store-devtools-wrapper'
import { WineListEmptyWineryFilters, WineListFilters, WineOfWinery } from './types'
import { IWine } from '@/modules/events/entities/types/wine-set.dto'
import { IWines } from '@/modules/wine/list/entities/types/types'

interface AddWinesState {
  wines: WineOfWinery[]
  winesEmptyWinery: IWine[]
  searchResults: WineOfWinery[]
  selectedWines: IWines[] | null
  filters: WineListFilters
  emptyWineryFilters: WineListEmptyWineryFilters
  setWines: (wines: WineOfWinery[]) => void
  setWinesEmptyWinery: (wines: IWine[]) => void
  setSearchResults: (results: WineOfWinery[]) => void
  setSelectedWines: (wines: IWines[] | null) => void
  setFilters: (filters: Partial<AddWinesState['filters']>) => void
  setEmptyWineryFilters: (filters: Partial<AddWinesState['emptyWineryFilters']>) => void
  resetFilters: () => void
  resetEmptyWineryFilters: () => void
}

export const useAddWinesStore = createStoreDevToolsWrapper<AddWinesState>(
  set => ({
    wines: [],
    winesEmptyWinery: [],
    searchResults: [],
    selectedWines: null,

    filters: {
      search: '',
      limit: DEFAULT_PAGINATION_LIMIT,
      page: 1,
    },

    emptyWineryFilters: {
      search: '',
      limit: DEFAULT_PAGINATION_LIMIT,
      page: 1,
      typeId: null,
      colorId: null,
      vintage: null,
      countryId: null,
      regionId: null,
      sortBy: undefined,
      wineryId: undefined,
    },

    setWines: (wines: WineOfWinery[]) => set({ wines }, false, 'addWine/setWines'),

    setWinesEmptyWinery: (wines: IWine[]) => set({ winesEmptyWinery: wines }, false, 'addWine/setWinesEmptyWinery'),

    setSearchResults: (results: WineOfWinery[]) => set({ searchResults: results }, false, 'addWine/setSearchResults'),

    setSelectedWines: (wines: IWines[] | null) => set({ selectedWines: wines }, false, 'addWine/setSelectedWines'),

    setFilters: (newFilters: Partial<AddWinesState['filters']>) =>
      set(
        (state: AddWinesState) => ({
          filters: { ...state.filters, ...newFilters },
        }),
        false,
        'addWine/setFilters'
      ),

    setEmptyWineryFilters: (newFilters: Partial<AddWinesState['emptyWineryFilters']>) =>
      set(
        (state: AddWinesState) => ({
          emptyWineryFilters: { ...state.emptyWineryFilters, ...newFilters },
        }),
        false,
        'addWine/setEmptyWineryFilters'
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
        'addWine/resetFilters'
      ),

    resetEmptyWineryFilters: () =>
      set(
        {
          emptyWineryFilters: {
            search: '',
            limit: DEFAULT_PAGINATION_LIMIT,
            page: 1,
          },
        },
        false,
        'addWine/resetEmptyWineryFilters'
      ),
  }),

  'AddWinesStore'
)
