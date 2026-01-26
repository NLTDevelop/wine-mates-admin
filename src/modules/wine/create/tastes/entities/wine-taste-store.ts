import { createStoreDevToolsWrapper } from '@/stores/create-store-devtools-wrapper'
import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'
import { getDisplayNames } from '@/lib/utils'
import { ReorderItem } from '../../general/entities/types'
import { WineTasteGroup, WineTasteItem } from './types/tastes'

interface WineTasteStoreState {
  tasteGroups: WineTasteGroup[]
  searchResults: WineTasteGroup[]
  currentTasteGroup: WineTasteGroup | null
  filters: {
    search: string
    limit: number
    page: number
    include?: string[]
  }

  setTasteGroups: (groups: WineTasteGroup[]) => void
  setCurrentTasteGroup: (group: WineTasteGroup | null) => void
  addTasteGroup: (group: WineTasteGroup) => void
  updateTasteGroup: (groupId: string, newGroup: WineTasteGroup) => void
  deleteTasteGroup: (groupId: string) => void
  reorderTasteGroups: (item: ReorderItem[]) => void
  searchTasteGroups: (searchTerm: string) => void
  clearSearch: () => void
  setFilters: (filters: Partial<WineTasteStoreState['filters']>) => void
  resetFilters: () => void

  addTaste: (groupId: string, taste: WineTasteItem) => void
  updateTaste: (groupId: string, tasteId: string, newTaste: WineTasteItem) => void
  deleteTaste: (groupId: string, tasteId: string) => void
  reorderTastes: (groupId: string, tastes: WineTasteItem[]) => void

  getTasteGroupById: (id: string) => WineTasteGroup | undefined
  hasTasteGroup: (id: string) => boolean
}

export const useWineTasteStore = createStoreDevToolsWrapper<WineTasteStoreState>(
  (set, get) => ({
    tasteGroups: [],
    searchResults: [],
    currentTasteGroup: null,
    filters: {
      search: '',
      limit: DEFAULT_PAGINATION_LIMIT,
      page: 1,
      include: ['taste'],
    },

    setTasteGroups: groups => set({ tasteGroups: groups }, false, 'tasteGroups/setTasteGroups'),

    setCurrentTasteGroup: group => set({ currentTasteGroup: group }, false, 'tasteGroups/setCurrentTasteGroup'),

    addTasteGroup: group =>
      set(
        (state: WineTasteStoreState) => ({
          TasteGroups: [...state.tasteGroups, group],
        }),
        false,
        'tasteGroups/addTasteGroup'
      ),

    updateTasteGroup: (groupId, newGroup) =>
      set(
        (state: WineTasteStoreState) => ({
          tasteGroups: state.tasteGroups.map(g => (g.id === groupId ? newGroup : g)),
          currentTasteGroup: state.currentTasteGroup?.id === groupId ? newGroup : state.currentTasteGroup,
          searchResults: state.searchResults.map(g => (g.id === groupId ? newGroup : g)),
        }),
        false,
        'tasteGroups/updateTasteGroup'
      ),

    deleteTasteGroup: groupId =>
      set(
        (state: WineTasteStoreState) => ({
          tasteGroups: state.tasteGroups.filter(g => g.id !== groupId),
          currentTasteGroup: state.currentTasteGroup?.id === groupId ? null : state.currentTasteGroup,
          searchResults: state.searchResults.filter(g => g.id !== groupId),
        }),
        false,
        'tasteGroups/deleteTasteGroup'
      ),

    reorderTasteGroups: (items: ReorderItem[]) =>
      set(
        (state: WineTasteStoreState) => {
          const sortMap = new Map(items.map(item => [item.id, item.sortNumber]))

          return {
            tasteGroups: state.tasteGroups
              .map(group => {
                const newSortNumber = sortMap.get(Number(group.id))
                return newSortNumber !== undefined ? { ...group, sortNumber: newSortNumber } : group
              })
              .sort((a, b) => a.sortNumber - b.sortNumber),
          }
        },
        false,
        'tasteGroups/reorderGroups'
      ),

    searchTasteGroups: searchTerm =>
      set(
        (state: WineTasteStoreState) => {
          const searchTermLower = searchTerm.toLowerCase()

          return {
            searchResults: state.tasteGroups.filter(group => {
              const { nameUa: groupNameUa, nameEn: groupNameEn } = getDisplayNames(group.translations)

              const groupMatch = groupNameUa.toLowerCase().includes(searchTermLower) || groupNameEn.toLowerCase().includes(searchTermLower)

              const tastesMatch = group.flavors?.some(tastes => {
                const { nameUa: tastesNameUa, nameEn: tastesNameEn } = getDisplayNames(tastes.translations)
                return tastesNameUa.toLowerCase().includes(searchTermLower) || tastesNameEn.toLowerCase().includes(searchTermLower)
              })

              return groupMatch || tastesMatch
            }),
          }
        },
        false,
        'tasteGroups/searchTAsteGroups'
      ),

    setFilters: newFilters =>
      set(
        (state: WineTasteStoreState) => ({
          filters: { ...state.filters, ...newFilters },
        }),
        false,
        'tasteGroups/setFilters'
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
        'tasteGroups/resetFilters'
      ),

    clearSearch: () => set({ searchResults: [] }, false, 'tasteGroups/clearSearch'),

    addTaste: (groupId, taste) =>
      set(
        (state: WineTasteStoreState) => ({
          tasteGroups: state.tasteGroups.map(g =>
            g.id === groupId
              ? {
                  ...g,
                  tastes: [...(g.flavors || []), taste],
                }
              : g
          ),
        }),
        false,
        'tasteGroups/addTaste'
      ),

    updateTaste: (groupId, tasteId, newTaste) =>
      set(
        (state: WineTasteStoreState) => ({
          tasteGroups: state.tasteGroups.map(g =>
            g.id === groupId
              ? {
                  ...g,
                  tastes: g.flavors?.map(t => (t.id === tasteId ? newTaste : t)),
                }
              : g
          ),
        }),
        false,
        'tasteGroups/updateTaste'
      ),

    deleteTaste: (groupId, tasteId) =>
      set(
        (state: WineTasteStoreState) => ({
          tasteGroups: state.tasteGroups.map(g =>
            g.id === groupId
              ? {
                  ...g,
                  tastes: g.flavors?.filter(t => t.id !== tasteId),
                }
              : g
          ),
        }),
        false,
        'tasteGroups/deleteTaste'
      ),

    reorderTastes: (groupId, tastes) =>
      set(
        (state: WineTasteStoreState) => ({
          tasteGroups: state.tasteGroups.map(g =>
            g.id === groupId
              ? {
                  ...g,
                  tastes: tastes,
                }
              : g
          ),
        }),
        false,
        'TasteGroups/reorderTastes'
      ),

    getTasteGroupById: id => {
      return get().tasteGroups.find((g: WineTasteGroup) => g.id === id)
    },

    hasTasteGroup: id => {
      return get().tasteGroups.some((t: WineTasteGroup) => t.id === id)
    },
  }),
  'WineTasteStore'
)
