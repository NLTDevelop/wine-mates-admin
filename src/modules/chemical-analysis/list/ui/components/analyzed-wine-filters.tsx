import { SearchInput } from '@/UIKit/shadcn/ui/input-search'
import { useTranslation } from 'react-i18next'

export const AnalyzedWineFilters = ({
  filterSearch,
  onChangeFilterSearch,
  onClearSearch,
}: {
  filterSearch: string
  onChangeFilterSearch: (value: React.ChangeEvent<HTMLInputElement>) => void
  onClearSearch: () => void
}) => {
  const { t } = useTranslation('analysis')

  const handleClear = () => {
    onClearSearch()
  }

  return (
    <div className="flex-1 items-center space-x-2">
      <SearchInput value={filterSearch} onChange={onChangeFilterSearch} handleClear={handleClear} placeholder={t('search_wine')} className="w-full" />
    </div>
  )
}
