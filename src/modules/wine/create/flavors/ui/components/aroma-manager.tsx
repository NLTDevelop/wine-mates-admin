import React from 'react'
import { Input } from '@/UIKit/shadcn/ui/input'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Plus, X, GripVertical } from 'lucide-react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { WineAromaItem } from '../../entities/types/flavor-types'

interface SortableAromaInputProps {
  aroma: WineAromaItem
  onUpdate: (id: string, field: 'nameUa' | 'nameEn', value: string) => void
  onRemove: (id: string) => void
}

const SortableAromaInput: React.FC<SortableAromaInputProps> = ({ aroma, onUpdate, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: aroma.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 w-full">
      <div {...attributes} {...listeners} className="flex-shrink-0 cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded">
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>

      <div className="flex gap-2 w-full">
        <Input value={aroma.nameUa} onChange={e => onUpdate(aroma.id, 'nameUa', e.target.value)} placeholder="Назва українською..." className="flex-1 h-8" />
        <Input value={aroma.nameEn} onChange={e => onUpdate(aroma.id, 'nameEn', e.target.value)} placeholder="Назва англійською..." className="flex-1 h-8" />
      </div>

      <Button type="button" variant="ghost" size="sm" onClick={() => onRemove(aroma.id)} className="h-8 w-8 p-0 hover:bg-red-50 flex-shrink-0">
        <X className="w-4 h-4 text-red-600" />
      </Button>
    </div>
  )
}

interface AromasManagerProps {
  aromas: WineAromaItem[]
  onAromasChange: (aromas: WineAromaItem[]) => void
}

export const AromasManager: React.FC<AromasManagerProps> = ({ aromas, onAromasChange }) => {

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const addNewAromaInput = () => {
    const newAroma: WineAromaItem = {
      id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      nameUa: '',
      nameEn: '',
      colorHex: '#cccccc',
      sortNumber: aromas.length,
    }

    onAromasChange([...aromas, newAroma])
  }

  const updateAroma = (aromaId: string, field: 'nameUa' | 'nameEn', value: string) => {
    const updatedAromas = aromas.map(aroma => (aroma.id === aromaId ? { ...aroma, [field]: value } : aroma))
    onAromasChange(updatedAromas)
  }

  const removeAroma = (aromaId: string) => {
    const updatedAromas = aromas.filter(aroma => aroma.id !== aromaId)
    onAromasChange(updatedAromas)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = aromas.findIndex(aroma => aroma.id === active.id)
      const newIndex = aromas.findIndex(aroma => aroma.id === over.id)

      const reorderedAromas = arrayMove(aromas, oldIndex, newIndex)
      onAromasChange(reorderedAromas)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Button type="button" variant="outline" size="sm" onClick={addNewAromaInput} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Додати аромат
        </Button>
      </div>

      {aromas.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={aromas.map(a => a.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {aromas.map(aroma => (
                <SortableAromaInput key={aroma.id} aroma={aroma} onUpdate={updateAroma} onRemove={removeAroma} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}
