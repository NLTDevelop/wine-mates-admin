import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { Card } from '@/UIKit/shadcn/ui/card'
import { WineTemplate } from '../../entities/types'
import { GripVertical } from 'lucide-react'

interface SortableTemplateCardProps {
  template: WineTemplate
  isSelected: boolean
  onSelect: (type: string) => void
}

export const SortableTemplateCard = ({ template, isSelected, onSelect }: SortableTemplateCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: template.type,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms cubic-bezier(0.2, 0, 0, 1)',
    height: '100%',
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        dnd-kit-drag transform-gpu will-change-transform
        ${isDragging ? 'z-50' : ''}
      `}
    >
      <Card
        className={`
          p-6 cursor-pointer border-2 transition-all hover:shadow-lg relative h-full
          ${isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
        `}
        onClick={() => onSelect(template.type)}
      >
        <div
          {...attributes}
          {...listeners}
          className="absolute top-3 right-3 cursor-grab active:cursor-grabbing p-2 rounded hover:bg-accent transition-colors select-none touch-none"
          onClick={e => e.stopPropagation()}
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>

        <div className="text-2xl mb-2">{template.icon}</div>
        <h3 className="font-semibold text-lg mb-2 pr-8">{template.name}</h3>
        <p className="text-muted-foreground text-sm">{template.description}</p>
      </Card>
    </div>
  )
}
