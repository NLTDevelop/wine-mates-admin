import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card } from '@/UIKit/shadcn/ui/card'
import { getWineTemplates } from '../../presenters/wine-templates'
import { WineTemplate } from '../../entities/types'
import { GripVertical } from 'lucide-react'

interface SortableWineTemplateSelectorProps {
  selectedTemplate: string
  onTemplateSelect: (templateType: string) => void
  onTemplatesReorder?: (templates: WineTemplate[]) => void
}

const SortableTemplateCard = ({ template, isSelected, onSelect }: { template: WineTemplate; isSelected: boolean; onSelect: (type: string) => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: template.type })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms cubic-bezier(0.2, 0, 0, 1)',
    height: '100%',
  }

  return (
    <div ref={setNodeRef} style={style} className="dnd-kit-drag transform-gpu will-change-transform">
      <Card
        className={`p-6 cursor-pointer border-2 transition-all hover:shadow-lg relative h-full ${isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
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

export const WineTemplateSelector = ({ selectedTemplate, onTemplateSelect, onTemplatesReorder }: SortableWineTemplateSelectorProps) => {
  const { t } = useTranslation('wines')
  const [templates, setTemplates] = useState<WineTemplate[]>(() =>
    getWineTemplates(t).map((template, index) => ({
      ...template,
      order: index,
    }))
  )

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = templates.findIndex(t => t.type === active.id)
      const newIndex = templates.findIndex(t => t.type === over.id)

      const newTemplates = arrayMove(templates, oldIndex, newIndex).map((template, index) => ({
        ...template,
        order: index,
      }))

      setTemplates(newTemplates)
      onTemplatesReorder?.(newTemplates)
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={templates.map(t => t.type)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map(template => (
            <SortableTemplateCard key={template.type} template={template} isSelected={selectedTemplate === template.type} onSelect={onTemplateSelect} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
