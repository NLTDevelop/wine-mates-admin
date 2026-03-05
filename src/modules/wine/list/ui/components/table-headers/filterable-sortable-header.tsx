import { Button } from '@/UIKit/shadcn/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/UIKit/shadcn/ui/dropdown-menu'
import { Filter, ArrowUpDown, ArrowUp, ArrowDown, Info, X } from 'lucide-react'

interface FilterOption {
  label: string
  value: any
  icon?: React.ReactNode
}

interface SortableFilterableHeaderProps {
  column: string
  label: string
  sortBy?: string
  onSort: (column?: string) => void
  onFilter: (column: string, value: any) => void
  filterOptions: FilterOption[]
  currentFilter?: any
  filterDisabled?: boolean
}

export const SortableFilterableHeader = ({ column, label, sortBy, onSort, onFilter, filterOptions, currentFilter, filterDisabled = false }: SortableFilterableHeaderProps) => {
  const isSorted = sortBy?.startsWith(column)
  const isFiltered = currentFilter !== undefined && currentFilter !== null && currentFilter !== ''
  const isActive = isSorted || isFiltered

  const getSortIcon = () => {
    if (!isSorted) return <ArrowUpDown className="h-4 w-4" />
    return sortBy?.endsWith('_asc') ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  const getIcon = () => {
    if (isFiltered) return <Filter className={`h-4 w-4 ${isActive ? 'text-primary' : ''}`} />
    return getSortIcon()
  }

  const handleClearSort = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSort(undefined)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={`hover:bg-transparent p-0 font-medium ${isActive ? 'text-primary' : ''}`}>
          <span className="flex gap-2 text-sm items-center">
            {label}
            {getIcon()}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-64">
        <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground flex items-center justify-between">
          <span>Sorting</span>
          {isSorted && (
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs hover:bg-muted" onClick={handleClearSort}>
              <X className="h-3 w-3 mr-1" />
              Clear sort
            </Button>
          )}
        </div>

        <DropdownMenuItem onClick={() => onSort(column)} className="justify-between">
          <div className="flex items-center gap-2">
            {getSortIcon()}
            <span>Sort by {label}</span>
          </div>
          {isSorted && <span className="text-xs">{sortBy?.endsWith('_asc') ? '↑ Ascending' : '↓ Descending'}</span>}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">Filtering</div>

        {filterDisabled ? (
          <div className="px-2 py-3 text-sm text-muted-foreground flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span>Select a country first to filter regions</span>
          </div>
        ) : (
          <>
            {isFiltered && (
              <DropdownMenuItem onClick={() => onFilter(column, null)}>
                <span className="text-muted-foreground">Clear filter</span>
              </DropdownMenuItem>
            )}

            <div className="max-h-60 overflow-y-auto">
              {filterOptions.length > 0 ? (
                filterOptions.map((option, index) => (
                  <DropdownMenuItem key={index} onClick={() => onFilter(column, option.value)} className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {option.icon}
                      {option.label}
                    </span>
                    {currentFilter === option.value && <span className="text-xs">✓</span>}
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="px-2 py-2 text-sm text-muted-foreground">No regions available</div>
              )}
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
