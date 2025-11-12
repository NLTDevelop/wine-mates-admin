import { createStoreDevToolsWrapper } from '@/stores/creare-store-devtools-wrapper'
import { WineAromaGroup, WineAromaItem, WineAromaSubgroup } from './types/flavor-types'

interface WineFlavorStoreState {
  aromaGroups: WineAromaGroup[]
  searchResults: WineAromaGroup[]
  currentAromaGroup: WineAromaGroup | null

  setAromaGroups: (groups: WineAromaGroup[]) => void
  setCurrentAromaGroup: (group: WineAromaGroup | null) => void
  addAromaGroup: (group: WineAromaGroup) => void
  updateAromaGroup: (groupId: string, newGroup: WineAromaGroup) => void
  deleteAromaGroup: (groupId: string) => void
  searchAromaGroups: (searchTerm: string) => void
  clearSearch: () => void

  addSubgroup: (groupId: string, subgroup: WineAromaSubgroup) => void
  updateSubgroup: (groupId: string, subgroupId: string, newSubgroup: WineAromaSubgroup) => void
  deleteSubgroup: (groupId: string, subgroupId: string) => void

  addAroma: (groupId: string, subgroupId: string, aroma: WineAromaItem) => void
  updateAroma: (groupId: string, subgroupId: string, aromaId: string, newAroma: WineAromaItem) => void
  deleteAroma: (groupId: string, subgroupId: string, aromaId: string) => void

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
          searchResults: state.aromaGroups.filter(
            g =>
              g.nameUa.toLowerCase().includes(searchTerm.toLowerCase()) ||
              g.nameEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              g.subgroups?.some(
                subgroup =>
                  subgroup.nameUa.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  subgroup.nameEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  subgroup.aromas?.some(aroma => aroma.nameUa.toLowerCase().includes(searchTerm.toLowerCase()) || aroma.nameEn?.toLowerCase().includes(searchTerm.toLowerCase()))
              )
          ),
        }),
        false,
        'aromaGroups/searchAromaGroups'
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

    addAroma: (groupId, subgroupId, aroma) =>
      set(
        (state: WineFlavorStoreState) => ({
          aromaGroups: state.aromaGroups.map(g =>
            g.id === groupId
              ? {
                  ...g,
                  subgroups: g.subgroups?.map(sg =>
                    sg.id === subgroupId
                      ? {
                          ...sg,
                          aromas: [...(sg.aromas || []), aroma],
                        }
                      : sg
                  ),
                }
              : g
          ),
        }),
        false,
        'aromaGroups/addAroma'
      ),

    updateAroma: (groupId, subgroupId, aromaId, newAroma) =>
      set(
        (state: WineFlavorStoreState) => ({
          aromaGroups: state.aromaGroups.map(g =>
            g.id === groupId
              ? {
                  ...g,
                  subgroups: g.subgroups?.map(sg =>
                    sg.id === subgroupId
                      ? {
                          ...sg,
                          aromas: sg.aromas?.map(a => (a.id === aromaId ? newAroma : a)),
                        }
                      : sg
                  ),
                }
              : g
          ),
        }),
        false,
        'aromaGroups/updateAroma'
      ),

    deleteAroma: (groupId, subgroupId, aromaId) =>
      set(
        (state: WineFlavorStoreState) => ({
          aromaGroups: state.aromaGroups.map(g =>
            g.id === groupId
              ? {
                  ...g,
                  subgroups: g.subgroups?.map(sg =>
                    sg.id === subgroupId
                      ? {
                          ...sg,
                          aromas: sg.aromas?.filter(a => a.id !== aromaId),
                        }
                      : sg
                  ),
                }
              : g
          ),
        }),
        false,
        'aromaGroups/deleteAroma'
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
