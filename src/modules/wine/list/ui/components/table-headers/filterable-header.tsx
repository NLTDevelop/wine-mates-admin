import { Button } from '@/UIKit/shadcn/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/UIKit/shadcn/ui/dropdown-menu'
import { Filter } from 'lucide-react'

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
  const isActive = currentFilter !== undefined && currentFilter !== null && currentFilter !== ''
  const filterColumn = `${column}Id`

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={`hover:bg-transparent p-0 font-medium ${isActive ? 'text-primary' : ''}`}>
          <span className="flex gap-2 text-sm">
            {label}
            {isActive && <span className="w-2 h-2 bg-primary rounded-full" />}
            <Filter className={`h-4 w-4 ${isActive ? 'text-primary' : ''}`} />
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-48">
        {isActive && (
          <>
            <DropdownMenuItem onClick={() => onFilter(filterColumn, null)}>
              <span className="text-muted-foreground">Clear filter</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <div className="max-h-60 overflow-y-auto">
          {filterOptions.map((option, index) => (
            <DropdownMenuItem key={index} onClick={() => onFilter(filterColumn, option.value)} className="flex items-center">
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
