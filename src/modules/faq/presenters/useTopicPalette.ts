import { useQuestions } from './useQuestions'
import { useQuestion } from './useQuestion'
import { useTopic } from './useTopic'
import { useTopicPaletteState } from './useTopicPaletteState'
import { useTopicUI } from './useTopicUI'

export const useTopicPalette = () => {
  const { topics, isLoading: questionLoading, isCreatingGroup, filters, onChangePagination, reorderGroup, isReorderingGroup } = useQuestion()

  const {
    state: { openAccordions, editingGroup, newItemData, editingGroupData, forceOpenKeys },
    setOpenAccordions,
    setEditingGroup,
    setNewItemData,
    setEditingGroupData,
    setForceOpenKeys,
  } = useTopicPaletteState()

  const groups = useTopic({
    topics,
    editingGroupData,
    setEditingGroup,
    setEditingGroupData,
    setForceOpenKeys,
    setOpenAccordions,
    setNewItemData,
  })

  const items = useQuestions({
    topics,
    editingGroup,
    newItemData,
    openAccordions,
    setEditingGroup,
    setNewItemData,
    setOpenAccordions,
  })

  const ui = useTopicUI({
    openAccordions,
    editingGroup,
    newItemData,
  })

  const isLoading = questionLoading || isCreatingGroup || isReorderingGroup

  return {
    topics,
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
