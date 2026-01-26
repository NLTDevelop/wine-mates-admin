import { useCallback, useMemo, useState } from 'react'
import { WineType } from '../../wine-types/entities/types/wine-type'
import { BaseWineColor } from '../../general/entities/types'

interface UseWineProfileProps {
  wineTypes: WineType[]
  cachedColors: BaseWineColor[]
  colorsLoading?: boolean
  wineTypesLoading?: boolean
}

export const useWineProfile = ({ wineTypes, cachedColors }: UseWineProfileProps) => {
  const [selectedType, setSelectedType] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')

  const typeNames = useMemo(() => {
    return wineTypes.map(wt => wt.translations) || []
  }, [wineTypes])

  const colorNames = useMemo(() => {
    return cachedColors.map(c => c.translations || []) || []
  }, [cachedColors])

  const handleTypeChange = useCallback((type: string) => {
    setSelectedType(type)
  }, [])

  const handleColorChange = useCallback((color: string) => {
    setSelectedColor(color)
  }, [])

  return {
    typeNames,
    colorNames,

    selectedType,
    selectedColor,

    handleTypeChange,
    handleColorChange,
    setSelectedType,
    setSelectedColor,
  }
}
