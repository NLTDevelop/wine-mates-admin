import { useState, useEffect } from 'react'
import { useWineOptions } from './useWineOptions'
import { BaseWineColor } from '../entities/types'

export const useCachedColors = () => {
  const { fetchColors } = useWineOptions()
  const [cachedColors, setCachedColors] = useState<BaseWineColor[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadColors = async () => {
      setIsLoading(true)
      try {
        const colors = await fetchColors()
        setCachedColors(colors)
      } finally {
        setIsLoading(false)
      }
    }
    loadColors()
  }, [fetchColors])

  return { cachedColors, isLoading }
}
