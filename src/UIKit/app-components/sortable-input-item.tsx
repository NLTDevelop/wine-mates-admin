import React from 'react'
import { Input } from '@/UIKit/shadcn/ui/input'
import { Button } from '@/UIKit/shadcn/ui/button'
import { X, GripVertical } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface SortableInputItemProps {
  id: string
  values: Record<string, string>
  fields: Array<{
    name: string
    placeholder: string
    label?: string
  }>
  onUpdate: (field: string, value: string) => void
  onRemove: () => void
  className?: string
}

export const SortableInputItem: React.FC<SortableInputItemProps> = ({ id, values, fields, onUpdate, onRemove, className = '' }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className={`flex items-center gap-2 w-full ${className}`}>
      <div {...attributes} {...listeners} className="flex-shrink-0 cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded">
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>

      <div className="flex gap-2 w-full">
        {fields.map(field => (
          <Input key={field.name} value={values[field.name] || ''} onChange={e => onUpdate(field.name, e.target.value)} placeholder={field.placeholder} className="flex-1 h-8" />
        ))}
      </div>

      <Button type="button" variant="ghost" size="sm" onClick={onRemove} className="h-8 w-8 p-0 hover:bg-red-50 flex-shrink-0">
        <X className="w-4 h-4 text-red-600" />
      </Button>
    </div>
  )
}
