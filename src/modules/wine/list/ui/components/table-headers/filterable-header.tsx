import { Button } from '@/UIKit/shadcn/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/UIKit/shadcn/ui/dropdown-menu'
import { Filter, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface FilterOption {
  label: string
  value: any
  icon?: React.ReactNode
}

interface FilterableHeaderProps {
  column: string
  label: string
  onFilter: (column: string, value: any) => void
  filterOptions: FilterOption[]
  currentFilter?: any
}

export const FilterableHeader = ({ column, label, onFilter, filterOptions, currentFilter }: FilterableHeaderProps) => {
  const { t } = useTranslation('wines')
  const isActive = currentFilter !== undefined && currentFilter !== null && currentFilter !== ''

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={` hover:text-input/50 hover:bg-transparent focus:border-none active:bg-transparent active:border-none p-0 font-medium ${isActive ? 'text-primary' : ''}`}>
          <span className="flex gap-2 text-sm">
            {label}
            <Filter className={`h-4 w-4 ${isActive ? 'text-primary' : ''}`} />
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground flex gap-2 items-center justify-between">
          <span>{t('filtering')}</span>
          {isActive && (
            <>
              <Button variant="delete" size="sm" className="h-6 px-2 text-xs" onClick={() => onFilter(column, null)}>
                <X className="h-3 w-3 mr-1" />
                <span>{t('clear')}</span>
              </Button>
              <DropdownMenuSeparator />
            </>
          )}
        </div>
        <div className="max-h-60 overflow-y-auto">
          {filterOptions.map((option, index) => (
            <DropdownMenuItem key={index} onClick={() => onFilter(column, option.value)} className="flex items-center">
              {option.icon}
              <span>{option.label}</span>
              {currentFilter === option.value && <span className="ml-auto text-xs">✓</span>}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
