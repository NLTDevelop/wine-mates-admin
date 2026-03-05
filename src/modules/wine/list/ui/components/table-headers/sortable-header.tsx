import { Button } from '@/UIKit/shadcn/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/UIKit/shadcn/ui/dropdown-menu'
import { ArrowUpDown, ArrowUp, ArrowDown, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface SortableHeaderProps {
  column: string
  label: string
  sortBy?: string
  onSort: (column?: string) => void
}

export const SortableHeader = ({ column, label, sortBy, onSort }: SortableHeaderProps) => {
  const { t } = useTranslation('wines')
  const isSorted = sortBy?.startsWith(column)

  const getIcon = () => {
    if (!isSorted) return <ArrowUpDown className="h-4 w-4" />
    return sortBy?.endsWith('_asc') ? <ArrowUp className="h-4 w-4 text-primary" /> : <ArrowDown className="h-4 w-4 text-primary" />
  }

  const handleClearSort = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSort(undefined)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={` hover:text-input/50 hover:bg-transparent focus:border-none active:bg-transparent active:border-none p-0 font-medium ${isSorted ? 'text-primary' : ''}`}>
          <span className="flex gap-2 text-sm items-center ">
            {label}
            {getIcon()}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground flex gap-2 items-center justify-between">
          <span>{t('sorting')}</span>
          {isSorted && (
            <Button variant="delete" size="sm" className="h-6 px-2 text-xs" onClick={handleClearSort}>
              <X className="h-3 w-3 mr-1" />
              {t('clear')}
            </Button>
          )}
        </div>

        <DropdownMenuItem onClick={() => onSort(column)} className="justify-between">
          <div className="flex items-center gap-2">
            {getIcon()}
            <span>{t('sort_by')}</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
