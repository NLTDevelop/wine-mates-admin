import React, { useCallback } from 'react'
import { Input } from '@/UIKit/shadcn/ui/input'
import { Button } from '@/UIKit/shadcn/ui/button'
import { X, GripVertical } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { LevelItem } from '../../entities/types/taste-characteristics'
import { useTranslation } from 'react-i18next'

interface SortableLevelInputProps {
  state: LevelItem
  onUpdate: (id: string, levelName: string) => void
  onRemove: (id: string) => void
  isRequired: boolean
}

export const SortableLevelInput: React.FC<SortableLevelInputProps> = ({ state, onUpdate, onRemove, isRequired }) => {
  const { t } = useTranslation('wines')
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: state.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate(state.id, e.target.value)
    },
    [state.id, onUpdate]
  )

  const handleRemoveClick = React.useCallback(() => {
    onRemove(state.id)
  }, [state.id, onRemove])

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 w-full">
      <div {...attributes} {...listeners} className="flex-shrink-0 cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded">
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>

      <div className="w-full">
        <Input value={state.levelName} onChange={handleInputChange} placeholder={t('taste_characteristics.entry_level')} className="flex-1 h-8" />
      </div>

      {!isRequired && (
        <Button type="button" variant="ghost" size="sm" onClick={handleRemoveClick} className="h-8 w-8 p-0 hover:bg-red-50 flex-shrink-0">
          <X className="w-4 h-4 text-red-600" />
        </Button>
      )}
    </div>
  )
}
SortableLevelInput.displayName = 'SortableLevelInput'
