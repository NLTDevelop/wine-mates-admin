import { Badge } from '@/UIKit/shadcn/ui/badge'
import { Button } from '@/UIKit/shadcn/ui/button'

interface SectionProps {
  title: string
  icon: React.ReactNode
  isExpanded: boolean
  onToggle: () => void
  children: React.ReactNode
  itemsCount?: number
}

export const Section = ({ title, icon, isExpanded, onToggle, children, itemsCount = 0 }: SectionProps) => (
  <div className="border border-input rounded-lg">
    <Button variant="outline" onClick={onToggle} className="w-full flex items-center justify-between hover:bg-muted/50 transition-colors p-3 h-full">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {icon}
        <span className="font-medium text-left break-words whitespace-normal truncate">{title}</span>
      </div>
      <Badge variant="default" className="flex-shrink-0 ml-2">
        {itemsCount}
      </Badge>
    </Button>
    {isExpanded && <div className="p-3 space-y-2">{children}</div>}
  </div>
)
