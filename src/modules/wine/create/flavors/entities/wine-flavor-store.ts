import { createStoreDevToolsWrapper } from '@/stores/creare-store-devtools-wrapper'
import { WineAromaGroup, WineAromaItem } from './types/flavor'

interface WineFlavorStoreState {
  aromaGroups: WineAromaGroup[]
  searchResults: WineAromaGroup[]
  currentAromaGroup: WineAromaGroup | null
  aromaItems: WineAromaItem[] 

  setAromaGroups: (groups: WineAromaGroup[]) => void
  setCurrentAromaGroup: (group: WineAromaGroup | null) => void
  addAromaGroup: (group: WineAromaGroup) => void
  updateAromaGroup: (groupId: string, newGroup: WineAromaGroup) => void
  deleteAromaGroup: (groupId: string) => void
  searchAromaGroups: (searchTerm: string) => void
  clearSearch: () => void

  setAromaItems: (items: WineAromaItem[]) => void
  addAromaItem: (groupId: string, item: WineAromaItem) => void
  updateAromaItem: (groupId: string, itemId: string, newItem: WineAromaItem) => void
  deleteAromaItem: (groupId: string, itemId: string) => void

  getAromaGroupById: (id: string) => WineAromaGroup | undefined
  getAromaGroupByValue: (value: string) => WineAromaGroup | undefined
  hasAromaGroup: (id: string) => boolean
  hasAromaGroupByValue: (value: string) => boolean
  getAromaItemById: (id: string) => WineAromaItem | undefined
}

export const useWineFlavorStore = createStoreDevToolsWrapper<WineFlavorStoreState>(
  (set, get) => ({
    aromaGroups: [],
    searchResults: [],
    currentAromaGroup: null,
    aromaItems: [],

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
        (state: WineFlavorStoreState) => ({
          searchResults: state.aromaGroups.filter(g => 
            g.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
            g.labelEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            g.value.toLowerCase().includes(searchTerm.toLowerCase())
          ),
        }),
        false,
        'aromaGroups/searchAromaGroups'
      ),

    clearSearch: () => set({ searchResults: [] }, false, 'aromaGroups/clearSearch'),

    setAromaItems: items => set({ aromaItems: items }, false, 'aromaGroups/setAromaItems'),

    addAromaItem: (groupId, item) =>
      set(
        (state: WineFlavorStoreState) => ({
          aromaGroups: state.aromaGroups.map(g => 
            g.id === groupId 
              ? { ...g, items: [...(g.items || []), item] }
              : g
          ),
          aromaItems: [...state.aromaItems, item],
        }),
        false,
        'aromaGroups/addAromaItem'
      ),

    updateAromaItem: (groupId, itemId, newItem) =>
      set(
        (state: WineFlavorStoreState) => ({
          aromaGroups: state.aromaGroups.map(g => 
            g.id === groupId 
              ? { 
                  ...g, 
                  items: g.items?.map(i => (i.id === itemId ? newItem : i)) 
                }
              : g
          ),
          aromaItems: state.aromaItems.map(i => (i.id === itemId ? newItem : i)),
        }),
        false,
        'aromaGroups/updateAromaItem'
      ),

    deleteAromaItem: (groupId, itemId) =>
      set(
        (state: WineFlavorStoreState) => ({
          aromaGroups: state.aromaGroups.map(g => 
            g.id === groupId 
              ? { ...g, items: g.items?.filter(i => i.id !== itemId) }
              : g
          ),
          aromaItems: state.aromaItems.filter(i => i.id !== itemId),
        }),
        false,
        'aromaGroups/deleteAromaItem'
      ),

    getAromaGroupById: id => {
      return get().aromaGroups.find((g: WineAromaGroup) => g.id === id)
    },

    getAromaGroupByValue: value => {
      return get().aromaGroups.find((g: WineAromaGroup) => g.value === value)
    },

    hasAromaGroup: id => {
      return get().aromaGroups.some((g: WineAromaGroup) => g.id === id)
    },

    hasAromaGroupByValue: value => {
      return get().aromaGroups.some((g: WineAromaGroup) => g.value === value)
    },

    getAromaItemById: id => {
      return get().aromaItems.find((i: WineAromaItem) => i.id === id)
    },
  }),
  'WineFlavorStore'
)