import { useWineTemplates } from '../../presenters/useWineTemplates'
import { SortableTemplateCard } from './sortable-template-card'

interface WineTemplateSelectorProps {
  selectedTemplate: string
  onTemplateSelect: (templateType: string) => void
}

export const WineTemplateSelector = ({ selectedTemplate, onTemplateSelect }: WineTemplateSelectorProps) => {
  const { templates, setSelectedTemplateType } = useWineTemplates()

  const handleTemplateSelect = (templateType: string) => {
    setSelectedTemplateType(templateType)
    onTemplateSelect(templateType)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4 ">
      {templates.map(template => (
        <SortableTemplateCard key={template.type} template={template} isSelected={selectedTemplate === template.type} onSelect={handleTemplateSelect} />
      ))}
    </div>
  )
}
