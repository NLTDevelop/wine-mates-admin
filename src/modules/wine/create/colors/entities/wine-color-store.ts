import { createStoreDevToolsWrapper } from '@/stores/creare-store-devtools-wrapper'
import { WineColorGroup, WineShades } from './types/color-types'
import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'

interface WineColorStoreState {
  colorGroups: WineColorGroup[]
  searchResults: WineColorGroup[]
  currentColorGroup: WineColorGroup | null
  filters: {
    search: string
    limit: number
    offset: number
  }

  setColorGroups: (groups: WineColorGroup[]) => void
  setCurrentColorGroup: (group: WineColorGroup | null) => void
  addColorGroup: (group: WineColorGroup) => void
  updateColorGroup: (groupId: string, newGroup: WineColorGroup) => void
  deleteColorGroup: (groupId: string) => void
  searchColorGroups: (searchTerm: string) => void
  clearSearch: () => void
  setFilters: (filters: Partial<WineColorStoreState['filters']>) => void
  resetFilters: () => void

  addShade: (groupId: string, shade: WineShades) => void
  updateShade: (groupId: string, shadeId: string, newShade: WineShades) => void
  deleteShade: (groupId: string, shadeId: string) => void

  getColorGroupById: (id: string) => WineColorGroup | undefined
  getShadeById: (groupId: string, shadeId: string) => WineShades | undefined
  hasColorGroup: (id: string) => boolean
}

export const useWineColorStore = createStoreDevToolsWrapper<WineColorStoreState>(
  (set, get) => ({
    colorGroups: [],
    searchResults: [],
    currentColorGroup: null,
    filters: {
      search: '',
      limit: DEFAULT_PAGINATION_LIMIT,
      offset: 0,
    },

    setColorGroups: groups => set({ colorGroups: groups }, false, 'colorGroups/setColorGroups'),

    setCurrentColorGroup: group => set({ currentColorGroup: group }, false, 'colorGroups/setCurrentColorGroup'),

    addColorGroup: group =>
      set(
        (state: WineColorStoreState) => ({
          colorGroups: [...state.colorGroups, group],
        }),
        false,
        'colorGroups/addColorGroup'
      ),

    updateColorGroup: (groupId, newGroup) =>
      set(
        (state: WineColorStoreState) => ({
          colorGroups: state.colorGroups.map(g => (g.id === groupId ? newGroup : g)),
          currentColorGroup: state.currentColorGroup?.id === groupId ? newGroup : state.currentColorGroup,
          searchResults: state.searchResults.map(g => (g.id === groupId ? newGroup : g)),
        }),
        false,
        'colorGroups/updateColorGroup'
      ),

    deleteColorGroup: groupId =>
      set(
        (state: WineColorStoreState) => ({
          colorGroups: state.colorGroups.filter(g => g.id !== groupId),
          currentColorGroup: state.currentColorGroup?.id === groupId ? null : state.currentColorGroup,
          searchResults: state.searchResults.filter(g => g.id !== groupId),
        }),
        false,
        'colorGroups/deleteColorGroup'
      ),

    setFilters: newFilters =>
      set(
        (state: WineColorStoreState) => ({
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
            offset: 0,
          },
        },
        false,
        'wineTypes/resetFilters'
      ),

    searchColorGroups: searchTerm =>
      set(
        (state: WineColorStoreState) => ({
          searchResults: state.colorGroups.filter(
            g =>
              g.nameUa.toLowerCase().includes(searchTerm.toLowerCase()) ||
              g.nameEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              g.shades?.some(shade => shade.nameUa.toLowerCase().includes(searchTerm.toLowerCase()) || shade.nameEn?.toLowerCase().includes(searchTerm.toLowerCase()))
          ),
        }),
        false,
        'colorGroups/searchColorGroups'
      ),

    clearSearch: () => set({ searchResults: [] }, false, 'colorGroups/clearSearch'),

    addShade: (groupId, shade) =>
      set(
        (state: WineColorStoreState) => ({
          colorGroups: state.colorGroups.map(g =>
            g.id === groupId
              ? {
                  ...g,
                  shades: [...(g.shades || []), shade],
                }
              : g
          ),
        }),
        false,
        'colorGroups/addShade'
      ),

    updateShade: (groupId, shadeId, newShade) =>
      set(
        (state: WineColorStoreState) => ({
          colorGroups: state.colorGroups.map(g =>
            g.id === groupId
              ? {
                  ...g,
                  shades: g.shades?.map(s => (s.id === shadeId ? newShade : s)),
                }
              : g
          ),
        }),
        false,
        'colorGroups/updateShade'
      ),

    deleteShade: (groupId, shadeId) =>
      set(
        (state: WineColorStoreState) => ({
          colorGroups: state.colorGroups.map(g =>
            g.id === groupId
              ? {
                  ...g,
                  shades: g.shades?.filter(s => s.id !== shadeId),
                }
              : g
          ),
        }),
        false,
        'colorGroups/deleteShade'
      ),

    getColorGroupById: id => {
      return get().colorGroups.find((g: WineColorGroup) => g.id === id)
    },

    getShadeById: (groupId, shadeId) => {
      const group = get().colorGroups.find((g: WineColorGroup) => g.id === groupId)
      return group?.shades?.find((s: WineShades) => s.id === shadeId)
    },

    hasColorGroup: id => {
      return get().colorGroups.some((g: WineColorGroup) => g.id === id)
    },
  }),
  'WineColorStore'
)
