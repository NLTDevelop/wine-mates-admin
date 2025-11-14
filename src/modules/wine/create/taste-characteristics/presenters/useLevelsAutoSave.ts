import { useCallback, useRef } from 'react'
import { LevelItem } from '../entities/types/taste-characteristics'

interface UseLevelsAutoSaveProps {
  characteristicId: string
  onSaveLevelName: (levelId: string, levelName: string) => Promise<void>
  onSaveLevelsOrder: (levels: LevelItem[]) => Promise<void>
  debounceDelay?: number
}

export const useLevelsAutoSave = ({ onSaveLevelName, onSaveLevelsOrder, debounceDelay = 500 }: UseLevelsAutoSaveProps) => {
  const saveTimeoutRef = useRef<NodeJS.Timeout>(null)

  const handleLevelNameBlur = useCallback(
    async (levelId: string, levelName: string) => {
      if (!levelName.trim()) return

      try {
        await onSaveLevelName(levelId, levelName)
      } catch (error) {
        console.error('Failed to save level name:', error)
      }
    },
    [onSaveLevelName]
  )

  const handleLevelsOrderChange = useCallback(
    (levels: LevelItem[]) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          await onSaveLevelsOrder(levels)
        } catch (error) {
          console.error('Failed to save levels order:', error)
        }
      }, debounceDelay)
    },
    [onSaveLevelsOrder, debounceDelay]
  )

  const cleanup = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
  }, [])

  return {
    handleLevelNameBlur,
    handleLevelsOrderChange,
    cleanup,
  }
}
