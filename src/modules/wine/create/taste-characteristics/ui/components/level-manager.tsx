import React, { useEffect, useState, useCallback } from 'react'
import { LevelItem } from '../../entities/types/taste-characteristics'
import { LevelList } from '..'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface LevelManagerProps {
  states: LevelItem[]
  onStatesChange: (states: LevelItem[]) => void
  minFields?: number
}

export const LevelManager: React.FC<LevelManagerProps> = ({ states, onStatesChange, minFields = 3 }) => {
  const { t } = useTranslation('wines')
  const [internalStates, setInternalStates] = useState<LevelItem[]>(() => {
    if (states.length === 0) {
      return Array.from({ length: minFields }, (_, index) => ({
        id: `state-${index}`,
        levelName: '',
        order: index,
      }))
    }
    return states
  })

  useEffect(() => {
    if (states.length === 0 && internalStates.length === minFields) {
      onStatesChange(internalStates)
    }
  }, [internalStates, states.length, onStatesChange, minFields])

  const handleAddState = useCallback(() => {
    const newState: LevelItem = {
      id: `state-${Date.now()}`,
      levelName: '',
      order: internalStates.length,
    }
    const newStates = [...internalStates, newState]
    setInternalStates(newStates)
    onStatesChange(newStates)
  }, [internalStates, onStatesChange])

  const handleUpdateState = useCallback(
    (stateId: string, stateName: string) => {
      const updatedStates = internalStates.map(state => (state.id === stateId ? { ...state, stateName } : state))
      setInternalStates(updatedStates)
      onStatesChange(updatedStates)
    },
    [internalStates, onStatesChange]
  )

  const handleRemoveState = useCallback(
    (stateId: string) => {
      if (internalStates.length > minFields) {
        const updatedStates = internalStates.filter(state => state.id !== stateId)
        setInternalStates(updatedStates)
        onStatesChange(updatedStates)
      }
    },
    [internalStates, minFields, onStatesChange]
  )

  const handleReorderStates = useCallback(
    (reorderedStates: LevelItem[]) => {
      setInternalStates(reorderedStates)
      onStatesChange(reorderedStates)
    },
    [onStatesChange]
  )

  return (
    <div className="space-y-3">
      <Button type="button" variant="outline" size="sm" onClick={handleAddState} className="flex items-center gap-2">
        <Plus className="w-4 h-4" />
        {t('button.add_level')}
      </Button>

      <LevelList states={internalStates} minFields={minFields} onUpdateState={handleUpdateState} onRemoveState={handleRemoveState} onReorderStates={handleReorderStates} />
    </div>
  )
}
