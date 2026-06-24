import React from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, rectSortingStrategy, arrayMove } from '@dnd-kit/sortable'

interface SortableListProps<T> {
  items: T[]
  onReorder: (reorderedItems: T[]) => void
  strategy?: 'vertical' | 'grid'
  children: React.ReactNode
  getId?: (item: T, index: number) => string
  contextId?: string
}

export const SortableList = <T,>({
  items,
  onReorder,
  strategy = 'vertical',
  children,
  getId = (item: any, index: number) => item.id || `item-${index}`,
  contextId = 'default-sortable-context',
}: SortableListProps<T>) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item, index) => getId(item, index) === active.id)
      const newIndex = items.findIndex((item, index) => getId(item, index) === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedItems = arrayMove(items, oldIndex, newIndex)
        onReorder(reorderedItems)
      }
    }
  }

  const sortableStrategy = strategy === 'grid' ? rectSortingStrategy : verticalListSortingStrategy

  return (
    <DndContext id={contextId} sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items?.map((item, index) => getId(item, index))} strategy={sortableStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  )
}
