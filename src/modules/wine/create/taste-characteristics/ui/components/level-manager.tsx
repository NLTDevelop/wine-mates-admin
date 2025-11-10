import React, { useCallback } from 'react'
import { LevelItem } from '../../entities/types/taste-characteristics'
import { LevelList } from '..'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface LevelManagerProps {
  states: LevelItem[]
  onStatesChange: (states: LevelItem[]) => void
  onLevelNameBlur?: (levelId: string, levelName: string) => void
  onLevelsOrderChange?: (levels: LevelItem[]) => void
  minFields?: number
   isSaving?: boolean
}

export const LevelManager: React.FC<LevelManagerProps> = ({ states, onStatesChange, onLevelNameBlur, onLevelsOrderChange, minFields = 3 ,isSaving = false }) => {
  const { t } = useTranslation('wines')

  const handleAddState = useCallback(() => {
    const newState: LevelItem = {
      id: `state-${Date.now()}`,
      levelName: '',
      order: states.length,
    }
    const newStates = [...states, newState]
    onStatesChange(newStates)
  }, [states, onStatesChange])

  const handleUpdateState = useCallback(
    (stateId: string, levelName: string) => {
      const updatedStates = states.map(state => (state.id === stateId ? { ...state, levelName } : state))
      onStatesChange(updatedStates)
    },
    [states, onStatesChange]
  )

  const handleRemoveState = useCallback(
    (stateId: string) => {
      if (states.length > minFields) {
        const updatedStates = states.filter(state => state.id !== stateId)
        onStatesChange(updatedStates)
        //Todo добавить апи для удаления
      }
    },
    [states, minFields, onStatesChange]
  )

  const handleReorderStates = useCallback(
    (reorderedStates: LevelItem[]) => {
      onStatesChange(reorderedStates)
      if (onLevelsOrderChange) {
        onLevelsOrderChange(reorderedStates)
      }
    },
    [onStatesChange]
  )

  const handleLevelNameBlur = useCallback(
    (levelId: string, levelName: string) => {
      if (onLevelNameBlur) {
        onLevelNameBlur(levelId, levelName)
      }
    },
    [onLevelNameBlur]
  )

  return (
    <div className="space-y-3">
      <Button type="button" variant="ghost" size="sm" onClick={handleAddState} className="flex items-center gap-2 mt-3 border-1 hover:bg-muted-foreground hover:text-input" disabled={isSaving}>
        <Plus className="w-4 h-4" />
        {t('button.add_level')}
      </Button>

      <LevelList states={states} minFields={minFields} onLevelNameBlur={handleLevelNameBlur} onUpdateState={handleUpdateState} onRemoveState={handleRemoveState} onReorderStates={handleReorderStates} />
    </div>
  )
}
