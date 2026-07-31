import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'
import { create } from 'zustand'
import { PartnerFilters } from './types'

interface PartnerStore {
  filters: PartnerFilters
  setFilters: (filters: Partial<PartnerFilters>) => void
  resetFilters: () => void
}

const defaultFilters: PartnerFilters = {
  limit: DEFAULT_PAGINATION_LIMIT,
  page: 1,
  search: '',
  status: null,
}

export const usePartnerStore = create<PartnerStore>(set => ({
  filters: defaultFilters,
  setFilters: filters => set(state => ({ filters: { ...state.filters, ...filters } })),
  resetFilters: () => set({ filters: defaultFilters }),
}))
