import { useCharacteristics } from './useCharacteristics'
import { useCharacteristicsPaletteState } from './useCharacteristicsPaletteState'
import { UseCharacteristicUI } from './useCharacteristicUI'
import { useTasteCharacteristics } from './useTasteCharacteristics'

export const useCharacteristicPalette = () => {
  const { tasteCharacteristics, isLoading: isCharacteristicsLoading, isCreating, reorderGroup, isReorderingGroup } = useTasteCharacteristics()

  const {
    state: { openAccordions, editingCharacteristic, newCharacteristicData, editingCharacteristicData, forceOpenKeys },
    setOpenAccordions,
    setEditingCharacteristic,
    setNewCharacteristicData,
    setEditingCharacteristicData,
    setForceOpenKeys,
  } = useCharacteristicsPaletteState()

  const characteristics = useCharacteristics({
    tasteCharacteristics,
    editingCharacteristicData,
    setEditingCharacteristic,
    setEditingCharacteristicData,
    setForceOpenKeys,
    setOpenAccordions,
    setNewCharacteristicData,
  })

  const ui = UseCharacteristicUI({
    openAccordions,
    editingCharacteristic,
    newItemData: newCharacteristicData,
  })

  const isLoading = isCharacteristicsLoading || isCreating

  return {
    tasteCharacteristics,
    isLoading,
    isCreating,
    isReorderingGroup,
    reorderGroup,

    openAccordions,
    editingCharacteristicData,
    forceOpenKeys,

    setOpenAccordions,
    setEditingCharacteristic,
    setNewCharacteristicData,
    setEditingCharacteristicData,

    characteristics,
    ui,
  }
}
