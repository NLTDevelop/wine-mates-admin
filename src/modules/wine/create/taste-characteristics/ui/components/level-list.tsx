import React, { useCallback } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { LevelItem } from '../../entities/types/taste-characteristics'
import { SortableLevelInput } from '..'

interface LevelListProps {
  states: LevelItem[]
  minFields: number
  onUpdateState: (stateId: string, levelName: string) => void
  onRemoveState: (stateId: string) => void
  onReorderStates: (reorderedStates: LevelItem[]) => void
  onLevelNameBlur?: (stateId: string, levelName: string) => void
}

export const LevelList: React.FC<LevelListProps> = React.memo(({ states, minFields, onUpdateState, onRemoveState, onReorderStates, onLevelNameBlur }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (over && active.id !== over.id) {
        const oldIndex = states.findIndex(state => state.id === active.id)
        const newIndex = states.findIndex(state => state.id === over.id)

        if (oldIndex !== -1 && newIndex !== -1) {
          const reorderedStates = arrayMove(states, oldIndex, newIndex)
          onReorderStates(reorderedStates)
        }
      }
    },
    [states, onReorderStates]
  )

  const handleUpdateState = useCallback(
    (stateId: string, levelName: string) => {
      onUpdateState(stateId, levelName)
    },
    [onUpdateState]
  )

  const handleRemoveState = useCallback(
    (stateId: string) => {
      onRemoveState(stateId)
    },
    [onRemoveState]
  )

    const handleLevelNameBlur = useCallback(
    (stateId: string, levelName: string) => {
      onLevelNameBlur?.(stateId, levelName)
    },
    [onLevelNameBlur]
  )

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={states.map(s => s.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {states.map((state, index) => {
            return <SortableLevelInput key={state.id} onBlur={handleLevelNameBlur} state={state} onUpdate={handleUpdateState} onRemove={handleRemoveState} isRequired={index < minFields} />
          })}
        </div>
      </SortableContext>
    </DndContext>
  )
})

LevelList.displayName = 'LevelList'

function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const newArray = array.slice()
  newArray.splice(to < 0 ? newArray.length + to : to, 0, newArray.splice(from, 1)[0])
  return newArray
}
