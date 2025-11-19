import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'
import { createStoreDevToolsWrapper } from '@/stores/creare-store-devtools-wrapper'

interface UserState {
  filters: {
    search: string
    limit: number
    page: number
  }
  setFilters: (filters: Partial<UserState['filters']>) => void
  resetFilters: () => void
}

export const useUserStore = createStoreDevToolsWrapper<UserState>(
  set => ({
    filters: {
      search: '',
      limit: DEFAULT_PAGINATION_LIMIT,
      page: 1,
    },
    setFilters: newFilters =>
      set(
        (state: UserState) => ({
          filters: { ...state.filters, ...newFilters },
        }),
        false,
        'user/setFilters'
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
        'user/resetFilters'
      ),
  }),
  'UserStore'
)
