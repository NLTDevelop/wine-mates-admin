import { create } from 'zustand'
import { WineColorGroup, WineShades } from './types/color-types'

interface WineColorStore {
  colorGroups: WineColorGroup[]
  searchResults: WineColorGroup[]
  currentColorGroup: WineColorGroup | null

  setColorGroups: (groups: WineColorGroup[]) => void
  addColorGroup: (group: WineColorGroup) => void
  updateColorGroup: (groupId: string, group: WineColorGroup) => void
  deleteColorGroup: (groupId: string) => void

  addShade: (groupId: string, shade: WineShades) => void
  updateShade: (groupId: string, shadeId: string, shade: WineShades) => void
  deleteShade: (groupId: string, shadeId: string) => void

  searchColorGroups: (searchTerm: string) => void
  clearSearch: () => void
  setCurrentColorGroup: (group: WineColorGroup | null) => void

  getColorGroupById: (id: string) => WineColorGroup | undefined
  getShadeById: (groupId: string, shadeId: string) => WineShades | undefined
  hasColorGroup: (id: string) => boolean
}

export const useWineColorStore = create<WineColorStore>((set, get) => ({
  colorGroups: [],
  searchResults: [],
  currentColorGroup: null,

  setColorGroups: groups => set({ colorGroups: groups }),

  addColorGroup: group =>
    set(state => ({
      colorGroups: [...state.colorGroups, group],
    })),

  updateColorGroup: (groupId, group) =>
    set(state => ({
      colorGroups: state.colorGroups.map(g => (g.id === groupId ? group : g)),
    })),

  deleteColorGroup: groupId =>
    set(state => ({
      colorGroups: state.colorGroups.filter(g => g.id !== groupId),
    })),

  addShade: (groupId, shade) =>
    set(state => ({
      colorGroups: state.colorGroups.map(group => (group.id === groupId ? { ...group, shades: [...(group.shades || []), shade] } : group)),
    })),

  updateShade: (groupId, shadeId, shade) =>
    set(state => ({
      colorGroups: state.colorGroups.map(group =>
        group.id === groupId
          ? {
              ...group,
              shades: (group.shades || []).map(s => (s.id === shadeId ? shade : s)),
            }
          : group
      ),
    })),

  deleteShade: (groupId, shadeId) =>
    set(state => ({
      colorGroups: state.colorGroups.map(group =>
        group.id === groupId
          ? {
              ...group,
              shades: (group.shades || []).filter(s => s.id !== shadeId),
            }
          : group
      ),
    })),

  searchColorGroups: searchTerm => {
    const { colorGroups } = get()
    if (!searchTerm.trim()) {
      set({ searchResults: colorGroups })
      return
    }

    const results = colorGroups.filter(group => group.nameUa.toLowerCase().includes(searchTerm.toLowerCase()) || group.nameEn.toLowerCase().includes(searchTerm.toLowerCase()))
    set({ searchResults: results })
  },

  clearSearch: () => set({ searchResults: [] }),

  setCurrentColorGroup: group => set({ currentColorGroup: group }),

  getColorGroupById: id => {
    const { colorGroups } = get()
    return colorGroups.find(group => group.id === id)
  },

  getShadeById: (groupId, shadeId) => {
    const group = get().getColorGroupById(groupId)
    return group?.shades?.find(shade => shade.id === shadeId)
  },

  hasColorGroup: id => {
    return get().colorGroups.some(group => group.id === id)
  },
}))
