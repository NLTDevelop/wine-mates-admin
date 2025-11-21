import { useState, useCallback } from 'react'
import { BaseWineColor } from '../entities/types'

interface UseColorSelectionProps {
  initialColors?: BaseWineColor[]
  cachedColors: BaseWineColor[]
}

export const useColorSelection = ({ initialColors = [], cachedColors }: UseColorSelectionProps) => {
  const [selectedColors, setSelectedColors] = useState<BaseWineColor[]>(initialColors)

  const colorValues = selectedColors.map(color => color?.id)

  const handleColorChange = useCallback(
    (value: string | string[]) => {
      const selectedValues = Array.isArray(value) ? value : [value]
      const selectedColorObjects = cachedColors.filter(color => selectedValues.includes(color?.id))
      setSelectedColors(selectedColorObjects)
    },
    [cachedColors]
  )

  const updateSelectedColors = useCallback((colors: BaseWineColor[]) => {
    setSelectedColors(colors)
  }, [])

  return {
    selectedColors,
    colorValues,
    handleColorChange,
    updateSelectedColors,
  }
}
