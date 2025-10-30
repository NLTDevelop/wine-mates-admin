import { cn } from '@/lib/utils'
import { Trash2, PenLine } from 'lucide-react'

interface PaletteItemActionsProps {
  isLoading: boolean
  onRemove: (id: string) => void
  dataId: string
  cardTextColorClass?: string
  onEdit?: () => void
  showEditButton?: boolean
}

export const PaletteItemActions = ({ onRemove, dataId, cardTextColorClass, onEdit, showEditButton = false }: PaletteItemActionsProps) => {
  return (
    <div className="flex gap-1 items-center">
      {showEditButton && onEdit && (
        <div
          onClick={e => {
            e.stopPropagation()
            onEdit()
          }}
          className={cn(cardTextColorClass, 'p-1.5 opacity-70 hover:opacity-100 flex-shrink-0')}
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
        className={cn(cardTextColorClass, 'p-1.5 opacity-70 hover:opacity-100 flex-shrink-0')}
        title="Delete"
      >
        <Trash2 className="w-4.5 h-4.5" />
      </div>
    </div>
  )
}
