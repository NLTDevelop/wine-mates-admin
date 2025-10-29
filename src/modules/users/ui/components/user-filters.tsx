import { SearchInput } from '@/UIKit/shadcn/ui/input-search'
import { useTranslation } from 'react-i18next'

export const UserFilters = ({
  filterSearch,
  onChangeFilterSearch,
  onClearSearch,
}: {
  filterSearch: string
  onChangeFilterSearch: (value: React.ChangeEvent<HTMLInputElement>) => void
  onClearSearch: () => void
}) => {
  const { t } = useTranslation('users')

  const handleClear = () => {
    onClearSearch()
  }

  return (
    <div className="flex-1 items-center space-x-2">
      <SearchInput value={filterSearch} onChange={onChangeFilterSearch} handleClear={handleClear} placeholder={t('search_user')} className="w-full" />
    </div>
  )
}
