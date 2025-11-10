import { useState, useCallback } from 'react'
import { CreateWineTasteCharacteristicParams, LevelItem, WineTasteCharacteristics } from '../entities/types/taste-characteristics'
import { BaseWineColor } from '../../general/entities/types'

interface UseCreateTasteCharacteristicProps {
  onCreateCharacteristic: (dto: CreateWineTasteCharacteristicParams & { levels?: LevelItem[]; colors?: BaseWineColor[] }) => Promise<WineTasteCharacteristics | void>
  isLoading?: boolean
  characteristicLevels?: LevelItem[]
  onCharacteristicLevelsChange?: (levels: LevelItem[]) => void
  fetchColors?: () => Promise<BaseWineColor[]>
}

interface UseCreateTasteCharacteristicReturn {
  isCreating: boolean
  newCharacteristic: {
    label: string
    labelEn: string
  }
  selectedColors: BaseWineColor[]
  colorValues: string[]
  canCreate: boolean

  handleStartCreating: () => void
  handleCreate: () => Promise<void>
  handleCancel: () => void
  updateCharacteristic: (field: 'label' | 'labelEn' | 'colors', value: string) => void
  handleColorChange: (value: string | string[]) => Promise<void>
}

export const useCreateTasteCharacteristic = ({
  onCreateCharacteristic,
  characteristicLevels = [],
  onCharacteristicLevelsChange,
  fetchColors,
}: UseCreateTasteCharacteristicProps): UseCreateTasteCharacteristicReturn => {
  const [isCreating, setIsCreating] = useState(false)
  const [newCharacteristic, setNewCharacteristic] = useState({
    label: '',
    labelEn: '',
  })
  const [selectedColors, setSelectedColors] = useState<BaseWineColor[]>([])

  const colorValues = selectedColors.map(color => color.id)

  const handleStartCreating = useCallback(() => {
    setIsCreating(true)

    const initialLevels = Array.from({ length: 3 }, (_, index) => ({
      id: `state-${Date.now()}-${index}`,
      levelName: '',
      order: index,
    }))

    if (onCharacteristicLevelsChange) {
      onCharacteristicLevelsChange(initialLevels)
    } else {
      console.error('onCharacteristicLevelsChange is not defined!')
    }
  }, [onCharacteristicLevelsChange])

  const handleColorChange = useCallback(
    async (value: string | string[]) => {
      if (!fetchColors) return

      const selectedValues = Array.isArray(value) ? value : [value]
      const allColors = await fetchColors()
      const selectedColorObjects = allColors.filter(color => selectedValues.includes(color.id))
      setSelectedColors(selectedColorObjects)
    },
    [fetchColors]
  )

  const handleCreate = useCallback(async () => {
    if (!newCharacteristic.label.trim()) {
      return
    }

    try {
      await onCreateCharacteristic({
        label: newCharacteristic.label,
        labelEn: newCharacteristic.labelEn,
        levels: characteristicLevels.filter(state => state.levelName.trim() !== ''),
        colors: selectedColors,
      })
      setNewCharacteristic({ label: '', labelEn: '' })
      setSelectedColors([])
      onCharacteristicLevelsChange?.([])
      setIsCreating(false)
    } catch (error) {
      console.error('Failed to create characteristic:', error)
    }
  }, [newCharacteristic, characteristicLevels, selectedColors, onCreateCharacteristic, onCharacteristicLevelsChange])

  const handleCancel = useCallback(() => {
    setIsCreating(false)
    setNewCharacteristic({ label: '', labelEn: '' })
    setSelectedColors([])
    onCharacteristicLevelsChange?.([])
  }, [onCharacteristicLevelsChange])

  const updateCharacteristic = useCallback((field: 'label' | 'labelEn' | 'colors', value: string) => {
    setNewCharacteristic(prev => ({ ...prev, [field]: value }))
  }, [])

  const canCreate =
    newCharacteristic.label.trim().length > 0 && newCharacteristic.labelEn.trim().length > 0 && characteristicLevels.length > 0 && characteristicLevels.every(c => c.levelName.trim() !== '')

  return {
    isCreating,
    newCharacteristic,
    selectedColors,
    colorValues,
    canCreate,

    handleStartCreating,
    handleCreate,
    handleCancel,
    updateCharacteristic,
    handleColorChange,
  }
}
