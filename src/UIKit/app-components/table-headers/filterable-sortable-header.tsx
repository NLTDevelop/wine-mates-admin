import { cn } from '@/lib/utils'
import { Button } from '@/UIKit/shadcn/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/UIKit/shadcn/ui/dropdown-menu'
import { Filter, ArrowUpDown, ArrowUp, ArrowDown, Info, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation('wines')
  const isSorted = sortBy?.startsWith(column)
  const isFiltered = currentFilter !== undefined && currentFilter !== null && currentFilter !== ''
  const isActive = isSorted || isFiltered

  const getSortIcon = () => {
    if (!isSorted) return <ArrowUpDown className="h-4 w-4" />
    return sortBy?.endsWith('_asc') ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />
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
        <Button
          variant="ghost"
          className={`focus-visible:ring-0 hover:text-input/50 hover:bg-transparent focus-visible:ring-transparent active:bg-transparent active:border-none p-0 font-medium ${isActive ? 'text-primary' : ''}`}
        >
          <span className="flex gap-2 text-sm items-center">
            {label}
            {getIcon()}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-64">
        <div className="py-1.5 text-sm font-semibold text-muted-foreground flex items-center justify-between">
          <span>{t('sorting')}</span>
          {isSorted && (
            <Button variant="delete" size="sm" className="h-6 px-2 text-xs" onClick={handleClearSort}>
              <X className="h-3 w-3 mr-1" />
              {t('clear')}
            </Button>
          )}
        </div>

        <DropdownMenuItem onClick={() => onSort(column)} className="bg-input cursor-pointer">
          <div className="mx-auto flex items-center gap-2 text-foreground">
            {getSortIcon()}
            <span>{t('sort_by')}</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <div className={cn('flex items-center justify-between', 'px-2 py-1.5 text-sm font-semibold text-muted-foreground')}>
          {t('filtering')}
          {isFiltered && (
            <Button variant="delete" size="sm" className="h-6 px-2 text-xs" onClick={() => onFilter(column, null)}>
              <X className="h-2 w-2 mr-1" />
              {t('clear')}
            </Button>
          )}
        </div>
        {filterDisabled ? (
          <div className="py-3 text-sm text-muted-foreground flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span>{t('select_country')}</span>
          </div>
        ) : (
          <>
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
                <div className="px-2 py-2 text-sm text-muted-foreground">{t('no_regions')}</div>
              )}
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
