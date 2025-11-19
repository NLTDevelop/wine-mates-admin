import { createStoreDevToolsWrapper } from '@/stores/creare-store-devtools-wrapper'
import { WineTaste } from './types/tastes'
import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'

interface TasteStoreState {
  tastes: WineTaste[]
  searchResults: WineTaste[]
  currentTaste: WineTaste | null
  filters: {
    search: string
    limit: number
    page: number
    include?: string[]
  }

  setTastes: (tastes: WineTaste[]) => void
  setCurrentTaste: (taste: WineTaste | null) => void
  addTaste: (taste: WineTaste) => void
  updateTaste: (tasteId: string, newTaste: WineTaste) => void
  deleteTaste: (tasteId: string) => void
  searchTastes: (searchTerm: string) => void
  clearSearch: () => void
  setFilters: (filters: Partial<TasteStoreState['filters']>) => void
  resetFilters: () => void

  getTasteById: (id: string) => WineTaste | undefined
  getTasteByValue: (value: string) => WineTaste | undefined
  hasTaste: (id: string) => boolean
  hasTasteByValue: (value: string) => boolean
}

export const useTasteStore = createStoreDevToolsWrapper<TasteStoreState>(
  (set, get) => ({
    tastes: [],
    searchResults: [],
    currentTaste: null,
    filters: {
      search: '',
      limit: DEFAULT_PAGINATION_LIMIT,
      page: 1,
      include: ['assigned-colors'],
    },

    setTastes: tastes => set({ tastes }, false, 'tastes/setTastes'),

    setCurrentTaste: taste => set({ currentTaste: taste }, false, 'tastes/setCurrentTaste'),

    addTaste: taste =>
      set(
        (state: TasteStoreState) => ({
          tastes: [...state.tastes, taste],
        }),
        false,
        'tastes/addTaste'
      ),

    updateTaste: (tasteId, newTaste) =>
      set(
        (state: TasteStoreState) => ({
          tastes: state.tastes.map(t => (t.id === tasteId ? newTaste : t)),
          currentTaste: state.currentTaste?.id === tasteId ? newTaste : state.currentTaste,
          searchResults: state.searchResults.map(t => (t.id === tasteId ? newTaste : t)),
        }),
        false,
        'tastes/updateTaste'
      ),

    deleteTaste: tasteId =>
      set(
        (state: TasteStoreState) => ({
          tastes: state.tastes.filter(t => t.id !== tasteId),
          currentTaste: state.currentTaste?.id === tasteId ? null : state.currentTaste,
          searchResults: state.searchResults.filter(t => t.id !== tasteId),
        }),
        false,
        'tastes/deleteTaste'
      ),

    setFilters: newFilters =>
      set(
        (state: TasteStoreState) => ({
          filters: { ...state.filters, ...newFilters },
        }),
        false,
        'tastes/setFilters'
      ),

    resetFilters: () =>
      set(
        {
          filters: {
            search: '',
            limit: DEFAULT_PAGINATION_LIMIT,
            page: 0,
          },
        },
        false,
        'tastes/resetFilters'
      ),

    searchTastes: searchTerm =>
      set(
        (state: TasteStoreState) => ({
          searchResults: state.tastes.filter(t => t.nameUa.toLowerCase().includes(searchTerm.toLowerCase()) || t.nameEn?.toLowerCase().includes(searchTerm.toLowerCase())),
        }),
        false,
        'tastes/searchTastes'
      ),

    clearSearch: () => set({ searchResults: [] }, false, 'tastes/clearSearch'),

    getTasteById: id => {
      return get().tastes.find((t: WineTaste) => t.id === id)
    },

    getTasteByValue: value => {
      return get().tastes.find((t: WineTaste) => t.colorHex === value)
    },

    hasTaste: id => {
      return get().tastes.some((t: WineTaste) => t.id === id)
    },

    hasTasteByValue: value => {
      return get().tastes.some((t: WineTaste) => t.colorHex === value)
    },
  }),
  'TasteStore'
)
