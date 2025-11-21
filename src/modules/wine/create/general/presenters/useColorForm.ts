import { useCallback, useEffect, useRef } from 'react'
import { BaseWineColor } from '../entities/types'
import { useColorSelection } from '../presenters/useColorSelection'
import { adaptFetchOptions } from '@/lib/utils'

interface UseColorFormProps {
  cachedColors: BaseWineColor[]
  initialColors?: BaseWineColor[]
  onColorsChange: (colors: BaseWineColor[]) => void
}

export const useColorForm = ({ cachedColors, initialColors = [], onColorsChange }: UseColorFormProps) => {
  const { selectedColors, colorValues, handleColorChange } = useColorSelection({
    cachedColors,
    initialColors,
  })


  const fetchOptions = useCallback(
    async (search?: string) => {
      return adaptFetchOptions(() => Promise.resolve(cachedColors))(search)
    },
    [cachedColors]
  )

  const prevSelectedColorsRef = useRef(selectedColors)

  useEffect(() => {
    const hasChanged = JSON.stringify(selectedColors) !== JSON.stringify(prevSelectedColorsRef.current)

    if (hasChanged) {
      onColorsChange(selectedColors)
      prevSelectedColorsRef.current = selectedColors
    }
  }, [selectedColors, onColorsChange])

  return {
    selectedColors,
    colorValues,
    handleColorChange,
    fetchOptions,
  }
}
