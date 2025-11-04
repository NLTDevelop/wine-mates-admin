import { useState } from 'react'
import { useWineTasteCharacteristics } from './useWineTasteCharacteristics'
import { CreateWineTasteCharacteristicParams, LevelItem } from '../entities/types/taste-characteristics'

interface EditingGroup {
  characteristicId: string
  editingLevel?: LevelItem
}

interface NewCharacteristicData {
  label: string
  labelEn: string
}

export const useTasteCharacteristicsPalette = () => {
  const {
    tasteCharacteristics,
    isLoading,
    createCharacteristic,
    updateCharacteristic,
    deleteCharacteristic,
    updateCharacteristicLevels,
    addCharacteristicLevel,
    updateCharacteristicLevel,
    deleteCharacteristicLevel,
    reorderCharacteristicLevels,
  } = useWineTasteCharacteristics()

  const [isFormOpen, setIsFormOpen] = useState<{ [key: string]: boolean }>({})
  const [isAccordionOpen, setIsAccordionOpen] = useState<{ [key: string]: boolean }>({})
  const [editingGroups, setEditingGroups] = useState<{ [key: string]: EditingGroup }>({})
  const [characteristicLevels, setCharacteristicLevels] = useState<{ [key: string]: LevelItem[] }>({
    'new-characteristic': [],
  })

  const [newCharacteristicData, setNewCharacteristicData] = useState<NewCharacteristicData>({
    label: '',
    labelEn: '',
  })

  const handleAddCharacteristic = async (dto: CreateWineTasteCharacteristicParams & { levels?: LevelItem[] }) => {
    const result = await createCharacteristic({
      ...dto,
      levels: characteristicLevels['new-characteristic'] || [],
    })

    setNewCharacteristicData({ label: '', labelEn: '' })
    setCharacteristicLevels(prev => ({ ...prev, ['new-characteristic']: [] }))

    return result
  }

  const handleUpdateCharacteristic = async (
    characteristicId: string,
    updates: {
      label?: string
      labelEn?: string
      levels?: LevelItem[]
    }
  ) => {
    return updateCharacteristic({
      characteristicId,
      newCharacteristic: updates,
    })
  }

  const handleDeleteCharacteristic = async (characteristicId: string) => {
    return deleteCharacteristic(characteristicId)
  }

  const handleUpdateCharacteristicLevels = async (characteristicId: string, levels: LevelItem[]) => {
    return updateCharacteristicLevels(characteristicId, levels)
  }

  const handleAddCharacteristicLevel = async (characteristicId: string, level: LevelItem) => {
    return addCharacteristicLevel(characteristicId, level)
  }

  const handleUpdateCharacteristicLevel = async (characteristicId: string, levelId: string, updatedLevel: LevelItem) => {
    return updateCharacteristicLevel(characteristicId, levelId, updatedLevel)
  }

  const handleDeleteCharacteristicLevel = async (characteristicId: string, levelId: string) => {
    return deleteCharacteristicLevel(characteristicId, levelId)
  }

  const handleReorderCharacteristicLevels = async (characteristicId: string, levelIds: string[]) => {
    return reorderCharacteristicLevels(characteristicId, levelIds)
  }

  const updateLocalCharacteristicLevels = (characteristicKey: string, levels: LevelItem[]) => {
    setCharacteristicLevels(prev => ({ ...prev, [characteristicKey]: levels }))
  }

  const getLocalCharacteristicLevels = (characteristicKey: string): LevelItem[] => {
    return characteristicLevels[characteristicKey] || []
  }

  const getNewCharacteristicLevels = (): LevelItem[] => {
    return characteristicLevels['new-characteristic'] || []
  }

  const getEditingGroup = (characteristicId: string): EditingGroup | undefined => {
    return editingGroups[characteristicId]
  }

  const handleEditLevel = (characteristicId: string, level: LevelItem) => {
    setEditingGroups(prev => ({
      ...prev,
      [characteristicId]: { characteristicId, editingLevel: level },
    }))
  }

  const handleCancelEdit = (characteristicId: string) => {
    setEditingGroups(prev => ({ ...prev, [characteristicId]: { characteristicId } }))
    handleToggleForm(characteristicId)
  }

  const handleToggleForm = (characteristicId: string) => {
    setIsFormOpen(prev => ({
      ...prev,
      [characteristicId]: !prev[characteristicId],
    }))
  }

  const handleToggleAccordion = (characteristicId: string, isOpen: boolean) => {
    setIsAccordionOpen(prev => ({
      ...prev,
      [characteristicId]: isOpen,
    }))
  }

  const updateNewCharacteristicData = (field: keyof NewCharacteristicData, value: string) => {
    setNewCharacteristicData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const canAddCharacteristic = (): boolean => {
    return !!(newCharacteristicData.label && newCharacteristicData.labelEn)
  }

  return {
    tasteCharacteristics,
    isLoading,
    isFormOpen,
    isAccordionOpen,
    newCharacteristicData,
    characteristicLevels,

    handleAddCharacteristic,
    handleUpdateCharacteristic,
    handleDeleteCharacteristic,
    handleToggleForm,
    handleToggleAccordion,
    handleCancelEdit,

    handleUpdateCharacteristicLevels,
    handleAddCharacteristicLevel,
    handleUpdateCharacteristicLevel,
    handleDeleteCharacteristicLevel,
    handleReorderCharacteristicLevels,
    handleEditLevel,

    updateLocalCharacteristicLevels,
    getLocalCharacteristicLevels,
    getNewCharacteristicLevels,

    updateNewCharacteristicData,
    canAddCharacteristic,

    getEditingGroup,
  }
}
