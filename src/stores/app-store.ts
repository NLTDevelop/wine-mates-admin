import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  sidebarCollapsed: boolean
  toggleSidebar: () => void

  globalLoading: boolean
  setGlobalLoading: (loading: boolean) => void

  tableFilters: {
    users: Record<string, any>
    products: Record<string, any>
  }
  setTableFilter: (table: keyof AppState['tableFilters'], filters: Record<string, any>) => void

  tableConfigs: {
    users: { pageSize: number; sortBy: 'createdAt' | string; sortOrder: 'asc' | 'desc' }
    products: { pageSize: number; sortBy: 'createdAt' | string; sortOrder: 'asc' | 'desc' }
  }
  updateTableConfig: (table: keyof AppState['tableConfigs'], config: Partial<AppState['tableConfigs'][keyof AppState['tableConfigs']]>) => void

  globalSearch: string
  setGlobalSearch: (search: string) => void

  banner: {
    visible: boolean
    message: string
    type: 'info' | 'warning' | 'error'
  } | null
  showBanner: (message: string, type?: 'info' | 'warning' | 'error') => void
  hideBanner: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    set => ({
      sidebarCollapsed: false,
      globalLoading: false,
      globalSearch: '',

      tableFilters: {
        users: {},
        products: {},
      } as AppState['tableFilters'],

      tableConfigs: {
        users: { pageSize: 30, sortBy: 'createdAt', sortOrder: 'desc' },
        products: { pageSize: 30, sortBy: 'createdAt', sortOrder: 'desc' },
      } as AppState['tableConfigs'],

      banner: null,

      toggleSidebar: () => set(state => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setGlobalLoading: loading => set({ globalLoading: loading }),

      setTableFilter: (table, filters) =>
        set(state => ({
          tableFilters: {
            ...state.tableFilters,
            [table]: { ...state.tableFilters[table], ...filters },
          },
        })),

      updateTableConfig: (table, config) =>
        set(state => ({
          tableConfigs: {
            ...state.tableConfigs,
            [table]: { ...state.tableConfigs[table], ...config },
          },
        })),

      setGlobalSearch: search => set({ globalSearch: search }),

      showBanner: (message, type = 'info') =>
        set({
          banner: {
            visible: true,
            message,
            type,
          },
        }),

      hideBanner: () => set({ banner: null }),
    }),
    {
      name: 'app-storage',
      partialize: state => ({
        sidebarCollapsed: state.sidebarCollapsed,
        tableConfigs: state.tableConfigs,
        tableFilters: state.tableFilters,
      }),
    }
  )
)
