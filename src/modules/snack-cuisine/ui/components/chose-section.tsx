import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { SearchInput } from '@/UIKit/shadcn/ui/input-search'
import { useTranslation } from 'react-i18next'
import { Checkbox } from '@/UIKit/shadcn/ui/checkbox'
import { Save, UtensilsCrossed } from 'lucide-react'
import { ChangeEvent } from 'react'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Country } from '@/modules/wine/create-wine/entities/types/location-types'

interface ChoseSectionProps {
  filteredCuisines: Country[]
  searchValue: string
  selectedIds: number[]
  handleClearSearch: () => void
  handleSearchChange: (e: ChangeEvent<HTMLInputElement, Element>) => void
  handleCheckboxChange: (id: number, checked: boolean) => void
  handleSave: () => void
  isSaving?: boolean
  isDeleting?: boolean
  selectedCount: number
  hasChanges: boolean
}

export const ChoseSection = ({
  filteredCuisines,
  searchValue,
  selectedIds,
  hasChanges,
  isSaving,
  selectedCount,
  handleClearSearch,
  handleSearchChange,
  handleCheckboxChange,
  handleSave,
}: ChoseSectionProps) => {
  const { t } = useTranslation('cuisine')
  const { t: tc } = useTranslation('common')

  const showSaveButton = hasChanges && selectedCount > 0 && !isSaving

  return (
    <Card className="border border-dashed p-0 w-1/2">
      <CardContent className="md:p-0 sm:p-0 h-[calc(100vh-200px)] flex flex-col overflow-hidden">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-medium flex items-center gap-2">
              <UtensilsCrossed />
              {t('chose_cuisine_title')}
            </h3>
            <p className="text-description">{t('chose_cuisine_desc')}</p>
          </div>

          {showSaveButton && (
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="w-4 h-4" />
              {`${tc('button.save')} (${selectedCount})`}
            </Button>
          )}
        </div>

        <div className="mb-4">
          <SearchInput value={searchValue} onChange={handleSearchChange} handleClear={handleClearSearch} placeholder={t('search_cuisine')} className="w-full" />
        </div>

        <div className="flex-1 overflow-y-auto pr-1 space-y-1 min-h-0 custom-scrollbar">
          {filteredCuisines.map(country => {
            const isChecked = selectedIds.includes(country.id)
            return (
              <label key={country.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/40 cursor-pointer transition-colors">
                <Checkbox
                  id={`cuisine-${country.id}`}
                  checked={isChecked}
                  onCheckedChange={checked => handleCheckboxChange(country.id, checked as boolean)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />

                <span className="text-sm inline-flex items-center justify-center w-6 h-6 select-none">{country.code}</span>
                <span className="text-sm font-medium text-foreground">{country.name}</span>
              </label>
            )
          })}
          {filteredCuisines.length === 0 && <p className="text-description text-center py-8">{tc('no_results')}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
