import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'
import { create } from 'zustand'

interface UserState {
  filters: {
    search: string
    limit: number
    offset: number
  }
  setFilters: (filters: Partial<UserState['filters']>) => void
  resetFilters: () => void
}

export const useUserStore = create<UserState>(set => ({
  filters: {
    search: '',
    limit: DEFAULT_PAGINATION_LIMIT,
    offset: 0,
  },
  setFilters: newFilters => set(state => ({ filters: { ...state.filters, ...newFilters } })),
  resetFilters: () => set({ filters: { search: '', limit: DEFAULT_PAGINATION_LIMIT, offset: 0 } }),
}))
