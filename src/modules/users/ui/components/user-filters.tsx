import { SearchInput } from '@/UIKit/shadcn/ui/input-search'
import { useTranslation } from 'react-i18next'

export const UserFilters = ({
  filterSearch,
  onChangeFilterSearch,
}: {
  filterSearch: string
  onChangeFilterSearch: (search: string) => void
}) => {
  const handleClear = () => {
    onChangeFilterSearch('')
  }

  const { t } = useTranslation('users')

  return (
    <div className="flex-1 items-center space-x-2">
      <SearchInput
        value={filterSearch}
        onChange={onChangeFilterSearch}
        handleClear={handleClear}
        placeholder={t('search_user')}
        className="w-full"
      />
    </div>
  )
}
