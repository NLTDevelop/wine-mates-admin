import { createStoreDevToolsWrapper } from '@/stores/creare-store-devtools-wrapper'
import { WineAromaGroup, WineAromaItem, WineAromaSubgroup } from './types/flavor-types'
import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'
import { getDisplayNames } from '@/lib/utils'

interface WineFlavorStoreState {
  aromaGroups: WineAromaGroup[]
  searchResults: WineAromaGroup[]
  currentAromaGroup: WineAromaGroup | null
  filters: {
    search: string
    limit: number
    page: number
    include?: string[]
  }

  setAromaGroups: (groups: WineAromaGroup[]) => void
  setCurrentAromaGroup: (group: WineAromaGroup | null) => void
  addAromaGroup: (group: WineAromaGroup) => void
  updateAromaGroup: (groupId: string, newGroup: WineAromaGroup) => void
  deleteAromaGroup: (groupId: string) => void
  searchAromaGroups: (searchTerm: string) => void
  clearSearch: () => void
  setFilters: (filters: Partial<WineFlavorStoreState['filters']>) => void
  resetFilters: () => void

  addSubgroup: (groupId: string, subgroup: WineAromaSubgroup) => void
  updateSubgroup: (groupId: string, subgroupId: string, newSubgroup: WineAromaSubgroup) => void
  deleteSubgroup: (groupId: string, subgroupId: string) => void

  getAromaGroupById: (id: string) => WineAromaGroup | undefined
  getSubgroupById: (groupId: string, subgroupId: string) => WineAromaSubgroup | undefined
  getAromaById: (groupId: string, subgroupId: string, aromaId: string) => WineAromaItem | undefined
  hasAromaGroup: (id: string) => boolean
}

export const useWineFlavorStore = createStoreDevToolsWrapper<WineFlavorStoreState>(
  (set, get) => ({
    aromaGroups: [],
    searchResults: [],
    currentAromaGroup: null,
    filters: {
      search: '',
      limit: DEFAULT_PAGINATION_LIMIT,
      page: 1,
      include: ['subgroups', 'assigned-colors'],
    },

    setAromaGroups: groups => set({ aromaGroups: groups }, false, 'aromaGroups/setAromaGroups'),

    setCurrentAromaGroup: group => set({ currentAromaGroup: group }, false, 'aromaGroups/setCurrentAromaGroup'),

    addAromaGroup: group =>
      set(
        (state: WineFlavorStoreState) => ({
          aromaGroups: [...state.aromaGroups, group],
        }),
        false,
        'aromaGroups/addAromaGroup'
      ),

    updateAromaGroup: (groupId, newGroup) =>
      set(
        (state: WineFlavorStoreState) => ({
          aromaGroups: state.aromaGroups.map(g => (g.id === groupId ? newGroup : g)),
          currentAromaGroup: state.currentAromaGroup?.id === groupId ? newGroup : state.currentAromaGroup,
          searchResults: state.searchResults.map(g => (g.id === groupId ? newGroup : g)),
        }),
        false,
        'aromaGroups/updateAromaGroup'
      ),

    deleteAromaGroup: groupId =>
      set(
        (state: WineFlavorStoreState) => ({
          aromaGroups: state.aromaGroups.filter(g => g.id !== groupId),
          currentAromaGroup: state.currentAromaGroup?.id === groupId ? null : state.currentAromaGroup,
          searchResults: state.searchResults.filter(g => g.id !== groupId),
        }),
        false,
        'aromaGroups/deleteAromaGroup'
      ),

    searchAromaGroups: searchTerm =>
      set(
        (state: WineFlavorStoreState) => {
          const searchTermLower = searchTerm.toLowerCase()

          return {
            searchResults: state.aromaGroups.filter(group => {
              const { nameUa: groupNameUa, nameEn: groupNameEn } = getDisplayNames(group.translations)

              const groupMatch = groupNameUa.toLowerCase().includes(searchTermLower) || groupNameEn.toLowerCase().includes(searchTermLower)

              const subgroupsMatch = group.subgroups?.some(subgroups => {
                const { nameUa: subgroupsNameUa, nameEn: subgroupsNameEn } = getDisplayNames(subgroups.translations)
                return subgroupsNameUa.toLowerCase().includes(searchTermLower) || subgroupsNameEn.toLowerCase().includes(searchTermLower)
              })
              const aromaMatch = group.subgroups?.some(subgroup => subgroup.aromas?.some(aroma => aroma.translations?.some(translation => translation.name.toLowerCase().includes(searchTermLower))))

              return groupMatch || subgroupsMatch || aromaMatch
            }),
          }
        },
        false,
        'colorGroups/searchColorGroups'
      ),

    setFilters: newFilters =>
      set(
        (state: WineFlavorStoreState) => ({
          filters: { ...state.filters, ...newFilters },
        }),
        false,
        'wineTypes/setFilters'
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
        'wineTypes/resetFilters'
      ),

    clearSearch: () => set({ searchResults: [] }, false, 'aromaGroups/clearSearch'),

    addSubgroup: (groupId, subgroup) =>
      set(
        (state: WineFlavorStoreState) => ({
          aromaGroups: state.aromaGroups.map(g =>
            g.id === groupId
              ? {
                  ...g,
                  subgroups: [...(g.subgroups || []), subgroup],
                }
              : g
          ),
        }),
        false,
        'aromaGroups/addSubgroup'
      ),

    updateSubgroup: (groupId, subgroupId, newSubgroup) =>
      set(
        (state: WineFlavorStoreState) => ({
          aromaGroups: state.aromaGroups.map(g =>
            g.id === groupId
              ? {
                  ...g,
                  subgroups: g.subgroups?.map(sg => (sg.id === subgroupId ? newSubgroup : sg)),
                }
              : g
          ),
        }),
        false,
        'aromaGroups/updateSubgroup'
      ),

    deleteSubgroup: (groupId, subgroupId) =>
      set(
        (state: WineFlavorStoreState) => ({
          aromaGroups: state.aromaGroups.map(g =>
            g.id === groupId
              ? {
                  ...g,
                  subgroups: g.subgroups?.filter(sg => sg.id !== subgroupId),
                }
              : g
          ),
        }),
        false,
        'aromaGroups/deleteSubgroup'
      ),

    getAromaGroupById: id => {
      return get().aromaGroups.find((g: WineAromaGroup) => g.id === id)
    },

    getSubgroupById: (groupId, subgroupId) => {
      const group = get().aromaGroups.find((g: WineAromaGroup) => g.id === groupId)
      return group?.subgroups?.find((sg: WineAromaSubgroup) => sg.id === subgroupId)
    },

    getAromaById: (groupId, subgroupId, aromaId) => {
      const subgroup = get().getSubgroupById(groupId, subgroupId)
      return subgroup?.aromas?.find((a: WineAromaItem) => a.id === aromaId)
    },

    hasAromaGroup: id => {
      return get().aromaGroups.some((g: WineAromaGroup) => g.id === id)
    },
  }),
  'WineFlavorStore'
)
