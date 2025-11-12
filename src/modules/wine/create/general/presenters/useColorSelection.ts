import { useState, useCallback } from 'react'
import { BaseWineColor } from '../entities/types'

interface UseColorSelectionProps {
  initialColors?: BaseWineColor[]
  fetchColors: () => Promise<BaseWineColor[]>
}

export const useColorSelection = ({ initialColors = [], fetchColors }: UseColorSelectionProps) => {
  const [selectedColors, setSelectedColors] = useState<BaseWineColor[]>(initialColors)

  const colorValues = selectedColors.map(color => color.id)

  const handleColorChange = useCallback(
    async (value: string | string[]) => {
      const selectedValues = Array.isArray(value) ? value : [value]
      const allColors = await fetchColors()
      const selectedColorObjects = allColors.filter(color => selectedValues.includes(color.id))
      setSelectedColors(selectedColorObjects)
    },
    [fetchColors]
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
