import { Check, Trash2, PenLine, Copy } from 'lucide-react'
import { Button } from '@/UIKit/shadcn/ui/button'
import { cn } from '@/lib/utils'

interface PaletteItemActionsProps {
  copied: boolean
  isNeedCopy: boolean
  isLoading: boolean

  handleMainClick: (event: React.MouseEvent) => void
  onRemove: (value: string) => void
  dataValue: string
  cardTextColorClass: string
  onEdit?: () => void
  showEditButton?: boolean
}

export const PaletteItemActions = ({ copied, isNeedCopy, isLoading, handleMainClick, onRemove, dataValue, cardTextColorClass, onEdit, showEditButton = false }: PaletteItemActionsProps) => {
  // console.log('PaletteItemActions:', {
  //   showEditButton,
  //   hasOnEdit: !!onEdit,
  //   dataValue,
  // })

  return (
    <div className="flex gap-1 items-center">
      {showEditButton && onEdit && (
        <Button
          size="sm"
          variant="ghost"
          onClick={e => {
            e.stopPropagation()
            onEdit()
          }}
          className={cn('h-6 w-6 p-0', cardTextColorClass)}
          title="edit"
        >
          <PenLine className="h-3 w-3" />
        </Button>
      )}

      {isNeedCopy && (
        <Button size="sm" variant="ghost" onClick={handleMainClick} className={cn('h-6 w-6 p-0', cardTextColorClass)}>
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={e => {
          e.stopPropagation()
          onRemove(dataValue)
        }}
        disabled={isLoading}
        className={cn(cardTextColorClass, 'p-1.5 opacity-70 hover:opacity-100 flex-shrink-0')}
      >
        {isNeedCopy && copied ? <Check className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
      </Button>
    </div>
  )
}
