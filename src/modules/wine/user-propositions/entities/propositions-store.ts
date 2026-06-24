import { create } from 'zustand'
import { PropositionsResponse, PropositionsType } from './types/types'
import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'

interface PropositionsState {
  activeTab: PropositionsType
  page: number
  search: string
  limit: number

  aromas?: PropositionsResponse
  flavors?: PropositionsResponse
  isLoading: boolean

  setActiveTab: (tab: PropositionsType) => void
  setPage: (page: number) => void
  setSearch: (search: string) => void
  setAromas: (aromas?: PropositionsResponse) => void
  setFlavors: (flavors?: PropositionsResponse) => void
  setIsLoading: (isLoading: boolean) => void

  resetPagination: () => void
}

export const usePropositionsStore = create<PropositionsState>(set => ({
  activeTab: 'taste',
  page: 1,
  search: '',
  limit: DEFAULT_PAGINATION_LIMIT,
  data: undefined,
  isLoading: false,

  setActiveTab: tab =>
    set(() => ({
      activeTab: tab,
      page: 1,
    })),

  setPage: page => set({ page }),

  setSearch: search =>
    set(() => ({
      search,
      page: 1,
    })),

  setAromas: aromas => set({ aromas }),

  setFlavors: flavors => set({ flavors }),

  setIsLoading: isLoading => set({ isLoading }),

  resetPagination: () => set({ page: 1, search: '' }),
}))
