import { useFlavorPaletteState } from './useFlavorPaletteState'
import { useFlavorGroups } from './useFlavorGroups'
import { useFlavorItems } from './useFlavorItems'
import { useFlavorUI } from './useFlavorUI'
import { useWineFlavor } from './useWineFlavors'

export const useFlavorPalette = () => {
  const { aromaGroups, isLoading: wineFlavorLoading, isCreatingGroup, totalCount, filters, onChangePagination, reorderGroup, isReorderingGroup } = useWineFlavor()

  const {
    state: { openAccordions, editingGroup, newItemData, editingGroupData, forceOpenKeys },
    setOpenAccordions,
    setEditingGroup,
    setNewItemData,
    setEditingGroupData,
    setForceOpenKeys,
  } = useFlavorPaletteState()

  const groups = useFlavorGroups({
    aromaGroups,
    editingGroupData,
    setEditingGroup,
    setEditingGroupData,
    setForceOpenKeys,
    setOpenAccordions,
    setNewItemData,
  })

  const items = useFlavorItems({
    aromaGroups,
    editingGroup,
    newItemData,
    openAccordions,
    setEditingGroup,
    setNewItemData,
    setOpenAccordions,
  })

  const ui = useFlavorUI({
    openAccordions,
    editingGroup,
    newItemData,
  })

  const isLoading = wineFlavorLoading || isCreatingGroup || isReorderingGroup

  return {
    aromaGroups,
    isLoading,
    isCreatingGroup,
    isReorderingGroup,
    reorderGroup,

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
