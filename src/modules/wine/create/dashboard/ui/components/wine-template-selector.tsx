import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable'
import { useWineTemplates } from '../../presenters/useWineTemplates'
import { SortableTemplateCard } from './sortable-template-card'
import { Skeleton } from '@/UIKit/shadcn/ui/skeleton'

interface WineTemplateSelectorProps {
  selectedTemplate: string
  onTemplateSelect: (templateType: string) => void
}

export const WineTemplateSelector = ({ selectedTemplate, onTemplateSelect }: WineTemplateSelectorProps) => {
  const { templates, isLoading, reorderTemplates, setSelectedTemplateType } = useWineTemplates()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleTemplateSelect = (templateType: string) => {
    setSelectedTemplateType(templateType)
    onTemplateSelect(templateType)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = templates.findIndex(t => t.type === active.id)
      const newIndex = templates.findIndex(t => t.type === over.id)

      const newTemplates = arrayMove(templates, oldIndex, newIndex).map((template, index) => ({
        ...template,
        order: index,
      }))
      reorderTemplates(newTemplates)
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4  gap-4">
        {[...Array(6)].map((_, index) => (
          <Skeleton key={index} className="h-40 rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={templates.map(t => t.type)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4 ">
          {templates.map(template => (
            <SortableTemplateCard key={template.type} template={template} isSelected={selectedTemplate === template.type} onSelect={handleTemplateSelect} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
