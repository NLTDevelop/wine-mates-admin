import { createStoreDevToolsWrapper } from '@/stores/create-store-devtools-wrapper'
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

  setSearchResults: (results: IWineForAnalysis[]) => void
  setCurrentWine: (wine: IWineForAnalysis | null) => void
  setFilters: (filters: Partial<AnalysisState['filters']>) => void
  resetFilters: () => void
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
  }),

  'AnalysisStore'
)
