import { useTasteGroups } from './useTasteGroups'
import { useTastePaletteState } from './useTastePaletteState'
import { useTasteItems } from './useTasteItems'
import { useTasteUI } from './useTasteUI'
import { useWineTaste } from './useWineTaste'

export const useTastePalette = () => {
  const { tasteGroups, isLoading: wineTasteLoading, isCreatingGroup, filters, onChangePagination, reorderGroup, isReorderingGroup } = useWineTaste()

  const {
    state: { openAccordions, editingGroup, newItemData, editingGroupData, forceOpenKeys },
    setOpenAccordions,
    setEditingGroup,
    setNewItemData,
    setEditingGroupData,
    setForceOpenKeys,
  } = useTastePaletteState()

  const groups = useTasteGroups({
    tasteGroups,
    editingGroupData,
    setEditingGroup,
    setEditingGroupData,
    setForceOpenKeys,
    setOpenAccordions,
    setNewItemData,
  })

  const items = useTasteItems({
    tasteGroups,
    editingGroup,
    newItemData,
    openAccordions,
    setEditingGroup,
    setNewItemData,
    setOpenAccordions,
  })

  const ui = useTasteUI({
    openAccordions,
    editingGroup,
    newItemData,
  })

  const isLoading = wineTasteLoading || isCreatingGroup || isReorderingGroup

  return {
    tasteGroups,
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

    filters,
    onChangePagination,
  }
}
