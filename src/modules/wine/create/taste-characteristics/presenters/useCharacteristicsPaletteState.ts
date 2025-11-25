import { useState } from 'react'
import { CreateWineTasteCharacteristicParams } from '../entities/taste-characteristics'
import { EditingCharacteristicState, NewCharacteristicData } from '../entities/characteristics-palette-types'

export const useCharacteristicsPaletteState = () => {
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set())
  const [editingCharacteristic, setEditingCharacteristic] = useState<EditingCharacteristicState | null>(null)
  const [newCharacteristicData, setNewCharacteristicData] = useState<Record<string, NewCharacteristicData>>({})
  const [editingCharacteristicData, setEditingCharacteristicData] = useState<Record<string, Partial<CreateWineTasteCharacteristicParams>>>({})
  const [forceOpenKeys, setForceOpenKeys] = useState<Record<string, number>>({})

  return {
    state: {
      openAccordions,
      editingCharacteristic,
      newCharacteristicData,
      editingCharacteristicData,
      forceOpenKeys,
    },
    setOpenAccordions,
    setEditingCharacteristic,
    setNewCharacteristicData,
    setEditingCharacteristicData,
    setForceOpenKeys,
  }
}
