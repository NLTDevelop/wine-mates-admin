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

export const LevelManager: React.FC<LevelManagerProps> = ({ states, onStatesChange, onLevelNameBlur, onLevelsOrderChange, minFields = 3, isSaving = false }) => {
  const { t } = useTranslation('wines')

  const handleAddState = useCallback(() => {
    const newState: LevelItem = {
      id: `state-${Date.now()}`,
      nameUa: '',
      nameEn: '',
      sortNumber: states.length,
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

      <LevelList
        states={states}
        minFields={minFields}
        onLevelNameBlur={handleLevelNameBlur}
        onUpdateState={handleUpdateState}
        onRemoveState={handleRemoveState}
        onReorderStates={handleReorderStates}
      />
    </div>
  )
}
// import React from 'react'
// import { Button } from '@/UIKit/shadcn/ui/button'
// import { Plus } from 'lucide-react'
// import { useTranslation } from 'react-i18next'
// import { SortableList } from '@/UIKit/app-components/sortable-list'
// import { SortableInputItem } from '@/UIKit/app-components/sortable-input-item'
// import { LevelItem } from '../../entities/types/taste-characteristics'

// interface LevelManagerProps {
//   levels: LevelItem[]
//   onLevelChange: (levels: LevelItem[]) => void
// }

// export const LevelManager: React.FC<LevelManagerProps> = ({ levels, onLevelChange }) => {
//   const { t } = useTranslation('wines')

//   const levelFields = [
//     {
//       name: 'nameUa',
//       placeholder: t('taste_characteristics.characteristic_name_ua'),
//       label: t('taste_characteristics.characteristic_name_ua'),
//     },
//     {
//       name: 'nameEn',
//       placeholder: t('taste_characteristics.characteristic_name_en'),
//       label: t('taste_characteristics.characteristic_name_en'),
//     },
//   ]

//   const addNewLevelInput = () => {
//     const newLevel: LevelItem = {
//       nameUa: '',
//       nameEn: '',
//     }
//     onLevelChange([...levels, newLevel])
//   }

//   const updateLevel = (index: number, field: string, value: string) => {
//     const updatedLevel = levels.map((level, i) => (i === index ? { ...level, [field]: value } : level))
//     onLevelChange(updatedLevel)
//   }

//   const removeLevel = (index: number) => {
//     const updatedLevels = levels.filter((_, i) => i !== index)
//     onLevelChange(updatedLevels)
//   }

//   const handleReorder = (reorderedLevels: LevelItem[]) => {
//     onLevelChange(reorderedLevels)
//   }

//   const getLevelId = (level: LevelItem, index: number): string => {
//     return level.id || `level-${index}`
//   }

//   return (
//     <div className="space-y-3">
//       <div className="flex items-center justify-between">
//         <Button type="button" variant="outline" size="sm" onClick={addNewLevelInput} className="flex items-center gap-2">
//           <Plus className="w-4 h-4" />
//           {t('button.add_level')}
//         </Button>
//       </div>

//       {levels.length > 0 && (
//         <SortableList items={levels} onReorder={handleReorder} strategy="vertical" getId={getLevelId}>
//           <div className="space-y-2">
//             {levels.map((level, index) => (
//               <SortableInputItem
//                 key={getLevelId(level, index)}
//                 id={getLevelId(level, index)}
//                 values={{
//                   nameUa: level.nameUa || '',
//                   nameEn: level.nameEn || '',
//                 }}
//                 fields={levelFields}
//                 onUpdate={(field, value) => updateLevel(index, field as keyof LevelItem, value)}
//                 onRemove={() => removeLevel(index)}
//               />
//             ))}
//           </div>
//         </SortableList>
//       )}
//     </div>
//   )
// }
