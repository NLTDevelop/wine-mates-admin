import { useCallback, useState } from 'react'
import { ImageItem } from '../enteties/types/types'
import { getImageFileFromPublic } from './getImageFile'

export const useImageFile = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getImageFile = useCallback(async (image: ImageItem): Promise<File> => {
    setIsLoading(true)
    setError(null)

    try {
      const fileName = image.src.split('/').pop() || `${image.alt}.jpg`
      const file = await getImageFileFromPublic(image.src, fileName)
      return file
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load image'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    getImageFile,
    isLoading,
    error,
  }
}
