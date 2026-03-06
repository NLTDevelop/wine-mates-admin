import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'
import { IReview, IWineFilters, IWines } from './types/types'
import { createStoreDevToolsWrapper } from '@/stores/create-store-devtools-wrapper'

interface WineState {
  wines: IWines[]
  searchResults: IWines[]
  currentWine: IWines | null
  filters: IWineFilters
  setWines: (wines: IWines[]) => void
  setReviews: (reviews: IReview[]) => void
  setSearchResults: (results: IWines[]) => void
  setCurrentWine: (wine: IWines | null) => void
  setFilters: (filters: Partial<WineState['filters']>) => void
  setReviewFilters: (filters: Partial<WineState['reviewFilters']>) => void
  resetFilters: () => void
  updateWine: (wineId: string, newWine: IWines) => void
  reviews: IReview[]
  reviewFilters: {
    search: string
    limit: number
    page: number
    wineId: number | null
  }
}

export const useWineStore = createStoreDevToolsWrapper<WineState>(
  set => ({
    wines: [],
    reviews: [],
    searchResults: [],
    currentWine: null,

    filters: {
      search: '',
      limit: DEFAULT_PAGINATION_LIMIT,
      page: 1,
      typeId: null,
      colorId: null,
      vintage: null,
      countryId: null,
      regionId: null,
      sortBy: undefined,
      sortOrder: 'asc',
    },
    reviewFilters: {
      search: '',
      limit: DEFAULT_PAGINATION_LIMIT,
      page: 1,
      wineId: null,
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

    setReviewFilters: (newFilters: Partial<WineState['reviewFilters']>) =>
      set(
        (state: WineState) => ({
          reviewFilters: { ...state.resetFilters, ...newFilters },
        }),
        false,
        'wine/setReviewFilters'
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

    setReviews: (reviews: IReview[]) => set({ reviews }, false, 'wine/setReviews'),
  }),

  'WineStore'
)
