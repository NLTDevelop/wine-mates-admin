import { useColorPaletteState } from './useColorPaletteState'
import { useColorGroups } from './useColorGroups'
import { useColorItems } from './useColorItems'
import { useColorUI } from './useColorUI'
import { useWineColor } from './useWineColors'

export const useColorPalette = () => {
  const { colorGroups, isLoading: wineColorLoading, isCreatingGroup, totalCount, filters, onChangePagination } = useWineColor()

  const {
    state: { openAccordions, editingGroup, newItemData, editingGroupData, forceOpenKeys },
    setOpenAccordions,
    setEditingGroup,
    setNewItemData,
    setEditingGroupData,
    setForceOpenKeys,
  } = useColorPaletteState()

  const groups = useColorGroups({
    colorGroups,
    editingGroupData,
    setEditingGroup,
    setEditingGroupData,
    setForceOpenKeys,
    setOpenAccordions,
    setNewItemData,
  })

  const items = useColorItems({
    editingGroup,
    newItemData,
    openAccordions,
    setEditingGroup,
    setNewItemData,
    setOpenAccordions,
    colorGroups,
  })

  const ui = useColorUI({
    openAccordions,
    editingGroup,
    newItemData,
  })

  const isLoading = wineColorLoading || isCreatingGroup

  return {
    colorGroups,
    isLoading,
    isCreatingGroup,

    openAccordions,
    editingGroup,
    newItemData,
    editingGroupData,
    forceOpenKeys,

    setOpenAccordions,
    setEditingGroup,
    setNewItemData,
    setEditingGroupData,

    groups,
    items,
    ui,

    totalCount,
    filters,
    onChangePagination,
  }
}
