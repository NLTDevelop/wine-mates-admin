import { Dispatch, SetStateAction } from 'react'
import { CreateTopicParams, FaqQuestion } from './types/types'
import { NameDictionary } from '@/modules/wine/create/general/entities/types'

export interface EditingTopicState {
  topicId: string
  groupId?: string
  editingItem?: FaqQuestion
  isEditingTopic: boolean
}

export interface NewItemData {
  questionTranslations: NameDictionary[]
  answerTranslations: NameDictionary[]
}

export interface ToggleCallbacks {
  setOpenAccordions: Dispatch<SetStateAction<Set<string>>>
  setEditingGroup: Dispatch<SetStateAction<EditingTopicState | null>>
  setNewItemData: Dispatch<SetStateAction<Record<string, NewItemData>>>
  setEditingGroupData: Dispatch<SetStateAction<Record<string, Partial<CreateTopicParams>>>>
}

export type FlavorPaletteHookReturn = {
  tasteGroups: any[]
  isLoading: boolean
  isCreatingGroup: boolean
  openAccordions: Set<string>
  editingGroup: EditingTopicState | null
  newItemData: Record<string, NewItemData>
  editingGroupData: Record<string, Partial<CreateTopicParams>>
  forceOpenKeys: Record<string, number>
  setOpenAccordions: Dispatch<SetStateAction<Set<string>>>
  setEditingGroup: Dispatch<SetStateAction<EditingTopicState | null>>
  setNewItemData: Dispatch<SetStateAction<Record<string, NewItemData>>>
  setEditingGroupData: Dispatch<SetStateAction<Record<string, Partial<CreateTopicParams>>>>
  groups: any
  ui: any
}
