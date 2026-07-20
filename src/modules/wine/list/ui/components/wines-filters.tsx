import { cn } from '@/lib/utils'
import { Button } from '@/UIKit/shadcn/ui/button'
import { SearchInput } from '@/UIKit/shadcn/ui/input-search'
import { useTranslation } from 'react-i18next'

export const WinesFilters = ({
  filterSearch,
  onChangeFilterSearch,
  onClearSearch,
  hasActiveFilters,
  clearColumnFilters,
  isClearFilterBtnAvailable
}: {
  filterSearch: string
  onChangeFilterSearch: (value: React.ChangeEvent<HTMLInputElement>) => void
  onClearSearch: () => void
  hasActiveFilters?: boolean
  clearColumnFilters?: () => void
  isClearFilterBtnAvailable?:boolean
}) => {
  const { t } = useTranslation('wines')

  const handleClear = () => {
    onClearSearch()
  }

  return (
    <div className="flex items-center space-x-2 w-full">
      <div className="flex-1">
        <SearchInput value={filterSearch} onChange={onChangeFilterSearch} handleClear={handleClear} placeholder={t('search_wine')} className="w-full" />
      </div>

      <div className="shrink-0">
        {isClearFilterBtnAvailable && (
          <Button
            variant="secondary"
            size="sm"
            onClick={clearColumnFilters}
            disabled={!hasActiveFilters}
            className={cn('transition-opacity h-11 whitespace-nowrap', !hasActiveFilters && 'opacity-50 cursor-not-allowed')}
          >
            {t('clear_all_filters')}
          </Button>
        )}
      </div>
    </div>
  )
}
