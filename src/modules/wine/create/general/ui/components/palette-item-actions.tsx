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
  deleteModal: () => void
}

export const PaletteItemActions = ({ cardTextColorClass, onEdit, showEditButton = false, variant = 'row', isHeader = false, deleteModal }: PaletteItemActionsProps) => {
  return (
    <div className={cn('flex gap-1 items-center cursor-default', variant !== 'row' ? 'flex-col sm:flex-row' : 'flex-row')}>
      {showEditButton && onEdit && (
        <div
          onClick={e => {
            e.stopPropagation()
            e.preventDefault()
            onEdit()
          }}
          className={cn(isHeader && cardTextColorClass, 'p-1.5 opacity-70 hover:opacity-100 flex-shrink-0 cursor-pointer')}
          title="Edit"
        >
          <PenLine className={cn('h-4 w-4', !cardTextColorClass && 'text-green-700')} />
        </div>
      )}

      <div
        onClick={e => {
          e.stopPropagation()
          e.preventDefault()
          deleteModal()
        }}
        className={cn(isHeader && cardTextColorClass, 'p-1.5 opacity-70 hover:opacity-100 flex-shrink-0 cursor-pointer')}
        title="Delete"
      >
        <Trash2 className={cn('w-4.5 h-4.5', !cardTextColorClass && 'text-red-600')} />
      </div>
    </div>
  )
}
