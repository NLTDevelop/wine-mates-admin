import { cn } from '@/lib/utils'
import { Trash2, PenLine } from 'lucide-react'

interface PaletteItemActionsProps {
  isLoading: boolean
  onRemove: (id: string) => void
  dataId: string
  cardTextColorClass?: string
  onEdit?: () => void
  showEditButton?: boolean
  variant?: 'row' | 'col'
  isHeader?: boolean
}

export const PaletteItemActions = ({ onRemove, dataId, cardTextColorClass, onEdit, showEditButton = false, variant = 'row',isHeader=false }: PaletteItemActionsProps) => {
  return (
    <div className={cn('flex gap-1 items-center', variant !== 'row' ? 'flex-col sm:flex-row' : 'flex-row')}>
      {showEditButton && onEdit && (
        <div
          onClick={e => {
            e.stopPropagation()
            onEdit()
          }}
          className={cn(isHeader && cardTextColorClass, 'p-1.5 opacity-70 hover:opacity-100 flex-shrink-0')}
          title="Edit"
        >
          <PenLine className="h-4 w-4" />
        </div>
      )}

      <div
        onClick={e => {
          e.stopPropagation()
          onRemove(dataId)
        }}
        className={cn(isHeader && cardTextColorClass, 'p-1.5 opacity-70 hover:opacity-100 flex-shrink-0')}
        title="Delete"
      >
        <Trash2 className="w-4.5 h-4.5" />
      </div>
    </div>
  )
}
