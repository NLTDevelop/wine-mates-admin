import { Button } from '@/UIKit/shadcn/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/UIKit/shadcn/ui/dropdown-menu'
import { ArrowUpDown, ArrowUp, ArrowDown, X } from 'lucide-react'

interface SortableHeaderProps {
  column: string
  label: string
  sortBy?: string
  onSort: (column?: string) => void
}

export const SortableHeader = ({ column, label, sortBy, onSort }: SortableHeaderProps) => {
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
        <Button variant="ghost" className={`hover:bg-transparent p-0 font-medium ${isSorted ? 'text-primary' : ''}`}>
          <span className="flex gap-2 text-sm items-center">
            {label}
            {getIcon()}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-48">
        <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground flex items-center justify-between">
          <span>Sorting</span>
          {isSorted && (
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs hover:bg-muted" onClick={handleClearSort}>
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>

        <DropdownMenuItem onClick={() => onSort(column)} className="justify-between">
          <div className="flex items-center gap-2">
            {getIcon()}
            <span>Sort by {label}</span>
          </div>
          {isSorted && <span className="text-xs">{sortBy?.endsWith('_asc') ? '↑' : '↓'}</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
