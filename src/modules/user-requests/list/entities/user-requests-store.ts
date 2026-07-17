import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'
import { createStoreDevToolsWrapper } from '@/stores/create-store-devtools-wrapper'
import { UserRequestType } from './types'

interface UserRequestsState {
  filters: {
    search: string
    limit: number
    page: number
    status: UserRequestType | null
  }
  setFilters: (filters: Partial<UserRequestsState['filters']>) => void
  resetFilters: () => void
}

export const useUserRequestsStore = createStoreDevToolsWrapper<UserRequestsState>(
  set => ({
    filters: {
      search: '',
      limit: DEFAULT_PAGINATION_LIMIT,
      page: 1,
      status: null
    },
    setFilters: newFilters =>
      set(
        (state: UserRequestsState) => ({
          filters: { ...state.filters, ...newFilters },
        }),
        false,
        'userRequests/setFilters'
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
        'userRequests/resetFilters'
      ),
  }),
  'UserRequestsStore'
)
