import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { useTranslation } from 'react-i18next'
import { ResultSection } from './result-section'
import { ChoseSection } from './chose-section'
import { useCuisine } from '../../presenters/useCuisine'

export const CuisineView = () => {
  const { t } = useTranslation('cuisine')
  const {
    filteredCuisines,
    searchValue,
    selectedIds,
    savedCuisines,
    selectedCount,
    isSaving,
    isLoading,
    hasChanges,
    isReordering,
    handleSave,
    handleClearSearch,
    handleSearchChange,
    handleCheckboxChange,
    handleRemove,
    handleClearAll,
    handleReorder,
  } = useCuisine()

  return (
    <>
      <h1 className="text-section">{t('word_cuisines')}</h1>
      <Card>
        <CardContent className="flex gap-4 sm:px-0 max-sm:px-0 sm:pb-0 max-sm:pb-0">
          <ChoseSection
            filteredCuisines={filteredCuisines}
            searchValue={searchValue}
            selectedIds={selectedIds}
            selectedCount={selectedCount}
            isSaving={isSaving}
            handleClearSearch={handleClearSearch}
            handleSearchChange={handleSearchChange}
            handleCheckboxChange={handleCheckboxChange}
            handleSave={handleSave}
            hasChanges={hasChanges}
          />

          <ResultSection isLoading={isLoading} savedCuisines={savedCuisines} handleRemove={handleRemove} handleClearAll={handleClearAll} handleReorder={handleReorder} isReordering={isReordering} />
        </CardContent>
      </Card>
    </>
  )
}
