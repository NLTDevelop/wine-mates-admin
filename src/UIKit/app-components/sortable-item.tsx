import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SortableItemProps {
  id: string
  children: React.ReactNode
  className?: string
  handleClassName?: string
  gridColor?: string
  disabled?: boolean
}

export const SortableItem: React.FC<SortableItemProps> = ({ id, children, className = '', handleClassName = '', gridColor = 'text-gray-400' }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className={`relative ${className} ${isDragging ? 'z-50' : ''}`}>
      <div
        {...attributes}
        {...listeners}
        className={`
          absolute cursor-grab active:cursor-grabbing 
          p-2 rounded hover:bg-accent transition-colors select-none touch-none z-10
          ${handleClassName}
        `}
        onClick={e => e.stopPropagation()}
      >
        <GripVertical className={cn('w-4 h-4', gridColor)} />
      </div>
      {children}
    </div>
  )
}
