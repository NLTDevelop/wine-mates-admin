import { useFlavorPaletteState } from './useFlavorPaletteState'
import { useFlavorGroups } from './useFlavorGroups'
import { useFlavorItems } from './useFlavorItems'
import { useFlavorUI } from './useFlavorUI'
import { useWineFlavor } from './useWineFlavors'
import { BaseWineColor } from '../../general/entities/types'

export const useFlavorPalette = (cachedColors: BaseWineColor[]) => {
  const { aromaGroups, isLoading: wineFlavorLoading, isCreatingGroup, totalCount, filters, onChangePagination } = useWineFlavor(cachedColors)

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
    cachedColors,
  })

  const items = useFlavorItems({
    aromaGroups,
    editingGroup,
    newItemData,
    openAccordions,
    setEditingGroup,
    setNewItemData,
    setOpenAccordions,
    cachedColors,
  })

  const ui = useFlavorUI({
    openAccordions,
    editingGroup,
    newItemData,
  })

  const isLoading = wineFlavorLoading || isCreatingGroup

  return {
    aromaGroups,
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
