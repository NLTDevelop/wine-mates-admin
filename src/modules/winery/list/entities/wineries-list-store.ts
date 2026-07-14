import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'
import { createStoreDevToolsWrapper } from '@/stores/create-store-devtools-wrapper'
import { IWinery, WineriesType, WineryFilters } from './types'

interface WineryState {
  wineries: IWinery[]
   activeTab: WineriesType
  searchResults: IWinery[]
  currentWinery: IWinery | null
  filters: WineryFilters
  setWineries: (wineries: IWinery[]) => void
  setActiveTab: (tab: WineriesType) => void
  setSearchResults: (results: IWinery[]) => void
  setCurrentWinery: (winery: IWinery | null) => void
  setFilters: (filters: Partial<WineryState['filters']>) => void
  resetFilters: () => void
}

export const useWineryStore = createStoreDevToolsWrapper<WineryState>(
  set => ({
    wineries: [],
    activeTab: 'approved',
    searchResults: [],
    currentWinery: null,

    filters: {
      search: '',
      limit: DEFAULT_PAGINATION_LIMIT,
      page: 1,
      countryId: null,
      regionId: null,
      status: 'approved',
    },

    setWineries: (wineries: IWinery[]) => set({ wineries }, false, 'winery/setWineries'),

    setActiveTab: tab =>set(() => ({activeTab: tab, page: 1})),

    setSearchResults: (results: IWinery[]) => set({ searchResults: results }, false, 'winery/setSearchResults'),

    setCurrentWinery: (winery: IWinery | null) => set({ currentWinery: winery }, false, 'winery/setCurrentWinery'),

    setFilters: (newFilters: Partial<WineryState['filters']>) =>
      set(
        (state: WineryState) => ({
          filters: { ...state.filters, ...newFilters },
        }),
        false,
        'winery/setFilters'
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
        'winery/resetFilters'
      ),
  }),

  'WineryStore'
)
