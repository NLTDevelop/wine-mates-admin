import React from 'react'
import { Input } from '@/UIKit/shadcn/ui/input'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Plus, X, GripVertical } from 'lucide-react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { StateItem } from '../../entities/types/flavor'

interface SortableStateInputProps {
  state: StateItem
  onUpdate: (id: string, stateName: string) => void
  onRemove: (id: string) => void
}

const SortableStateInput: React.FC<SortableStateInputProps> = ({ state, onUpdate, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: state.id })

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
      <div className="w-full">
        <Input value={state.stateName} onChange={e => onUpdate(state.id, e.target.value)} placeholder="Введіть стан аромату..." className="flex-1 h-8" />
      </div>

      <Button type="button" variant="ghost" size="sm" onClick={() => onRemove(state.id)} className="h-8 w-8 p-0 hover:bg-red-50 flex-shrink-0">
        <X className="w-4 h-4 text-red-600" />
      </Button>
    </div>
  )
}

interface StatesManagerProps {
  states: StateItem[]
  onStatesChange: (states: StateItem[]) => void
}

export const StatesManager: React.FC<StatesManagerProps> = ({ states, onStatesChange }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const addNewStateInput = () => {
    const newState: StateItem = {
      id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      stateName: '',
      order: states.length,
    }

    onStatesChange([...states, newState])
  }

  const updateState = (stateId: string, stateName: string) => {
    const updatedStates = states.map(state => (state.id === stateId ? { ...state, stateName } : state))
    onStatesChange(updatedStates)
  }

  const removeState = (stateId: string) => {
    const updatedStates = states.filter(state => state.id !== stateId)
    onStatesChange(updatedStates)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = states.findIndex(state => state.id === active.id)
      const newIndex = states.findIndex(state => state.id === over.id)

      const reorderedStates = arrayMove(states, oldIndex, newIndex)
      onStatesChange(reorderedStates)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-700">Стан аромату</h4>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addNewStateInput} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Додати стан
        </Button>
      </div>

      {states.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={states.map(s => s.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {states.map(state => (
                <SortableStateInput key={state.id} state={state} onUpdate={updateState} onRemove={removeState} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}
