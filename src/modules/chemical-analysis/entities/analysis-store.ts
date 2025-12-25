import { createStoreDevToolsWrapper } from '@/stores/create-store-devtools-wrapper'
import { IAnalysisReview } from '../detail/entities/types'
import { IWineForAnalysis } from '../list/entities/types'
import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'

export interface AnalysisState {
  analyzedWine: IWineForAnalysis[]
  searchResults: IWineForAnalysis[]
  currentWine: IWineForAnalysis | null
  filters: {
    search: string
    limit: number
    page: number
  }
  setWines: (wines: IWineForAnalysis[]) => void
  setReviews: (reviews: IAnalysisReview[]) => void
  setSearchResults: (results: IWineForAnalysis[]) => void
  setCurrentWine: (wine: IWineForAnalysis | null) => void
  setFilters: (filters: Partial<AnalysisState['filters']>) => void
  setReviewFilters: (filters: Partial<AnalysisState['reviewFilters']>) => void
  resetFilters: () => void
  reviews: IAnalysisReview[]
  reviewFilters: {
    search: string
    limit: number
    page: number
    wineId: number | null
  }
}

export const useAnalysisStore = createStoreDevToolsWrapper<AnalysisState>(
  set => ({
    analyzedWine: [],
    reviews: [],
    searchResults: [],
    currentWine: null,
    filters: {
      search: '',
      limit: DEFAULT_PAGINATION_LIMIT,
      page: 1,
    },
    reviewFilters: {
      search: '',
      limit: DEFAULT_PAGINATION_LIMIT,
      page: 1,
      wineId: null,
    },

    setWines: (wines: IWineForAnalysis[]) => set({ wines }, false, 'analysis/setWines'),

    setSearchResults: (results: IWineForAnalysis[]) => set({ searchResults: results }, false, 'analysis/setSearchResults'),

    setCurrentWine: (wine: IWineForAnalysis | null) => set({ currentWine: wine }, false, 'analysis/setCurrentWine'),

    setFilters: (newFilters: Partial<AnalysisState['filters']>) =>
      set(
        (state: AnalysisState) => ({
          filters: { ...state.filters, ...newFilters },
        }),
        false,
        'analysis/setFilters'
      ),

    setReviewFilters: (newFilters: Partial<AnalysisState['reviewFilters']>) =>
      set(
        (state: AnalysisState) => ({
          reviewFilters: { ...state.resetFilters, ...newFilters },
        }),
        false,
        'analysis/setReviewFilters'
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
        'analysis/resetFilters'
      ),

    setReviews: (reviews: IAnalysisReview[]) => set({ reviews }, false, 'analysis/setReviews'),
  }),

  'AnalysisStore'
)
