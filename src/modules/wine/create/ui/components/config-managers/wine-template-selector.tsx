import { Card } from '@/UIKit/shadcn/ui/card'
import { getWineTemplates } from '../../../entities/wine-templates'
import { useTranslation } from 'react-i18next'

interface WineTemplateSelectorProps {
  selectedTemplate: string
  onTemplateSelect: (templateType: string) => void
}

export const WineTemplateSelector = ({ selectedTemplate, onTemplateSelect }: WineTemplateSelectorProps) => {
  const { t } = useTranslation('wines')

  const WINE_TEMPLATES = getWineTemplates(t)
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {WINE_TEMPLATES.map(template => (
        <Card
          key={template.type}
          className={`p-6 cursor-pointer border-2 transition-all hover:shadow-lg ${selectedTemplate === template.type ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
          onClick={() => onTemplateSelect(template.type)}
        >
          <div className="text-2xl mb-2">{template.icon}</div>
          <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
          <p className="text-muted-foreground text-sm">{template.description}</p>
        </Card>
      ))}
    </div>
  )
}
