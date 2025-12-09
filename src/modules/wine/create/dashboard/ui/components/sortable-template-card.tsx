
import { Card } from '@/UIKit/shadcn/ui/card'
import { WineTemplate } from '../../entities/types'


interface SortableTemplateCardProps {
  template: WineTemplate
  isSelected: boolean
  onSelect: (type: string) => void
}

export const SortableTemplateCard = ({ template, isSelected, onSelect }: SortableTemplateCardProps) => {


  return (
    <div className="dnd-kit-drag transform-gpu will-change-transform">
      <Card
        className={`
          p-6 cursor-pointer border-2 transition-all hover:shadow-lg relative h-full
          ${isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
        `}
        onClick={() => onSelect(template.type)}
      >
        <div className="text-2xl mb-2">{template.icon}</div>
        <h3 className="font-semibold text-lg mb-2 pr-8">{template.name}</h3>
        <p className="text-muted-foreground text-sm">{template.description}</p>
      </Card>
    </div>
  )
}
