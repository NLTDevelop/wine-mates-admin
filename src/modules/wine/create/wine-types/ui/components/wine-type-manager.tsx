import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { PaletteItemActions } from '@/modules/wine/create/general/ui'
import { useWineTypePalette } from '../../presenters/useWineTypePalette'
import { CreateWineTypeSection, WineTypeForm } from '..'
import { BaseWineColor } from '../../../general/entities/types'
import { cn } from '@/lib/utils'
import { NLTTablePagination } from '@/UIKit/components/NLTTablePagination'
import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'

interface WineTypeManagerProps {
  cachedColors: BaseWineColor[]
  colorsLoading?: boolean
}

export const WineTypeManager = ({ cachedColors, colorsLoading = false }: WineTypeManagerProps) => {
  const {
    wineTypes,
    isLoading,
    isFormOpen,
    handleAddWineType,
    handleDeleteWineType,
    handleToggleForm,
    handleCancelEdit,
    formData,
    updateFormData,
    handleSaveWineType,
    hasChanges,
    totalCount,
    filters,
    onChangePagination,
  } = useWineTypePalette(cachedColors)

  return (
    <Card>
      <CardContent className="space-y-2 sm:space-y-6 max-sm:p-0 sm:p-0">
        <div>
          <CreateWineTypeSection onCreateWineType={handleAddWineType} isLoading={isLoading} cachedColors={cachedColors} isShowEmptyState={!isLoading && (!wineTypes || wineTypes.length === 0)} />
        </div>
        <div className="mx-auto flex flex-col justify-center gap-2 w-full">
          {wineTypes?.map(wineType => {
            const isEditing = isFormOpen[wineType.id] || false
            const currentFormData = formData[wineType.id]

            return (
              <div
                key={wineType.id}
                className={cn(
                  'border-1 border-input rounded-md transition-all cursor-default',
                  isEditing && 'rounded-md bg-card text-card-foreground shadow-sm card-spacing box-border border-border transition-colors border-dashed p-0'
                )}
              >
                <div className={cn(!isEditing && 'p-2')}>
                  {!isEditing ? (
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {wineType.nameUa} ({wineType.nameEn})
                        </span>
                        {wineType.colors?.map(color => (
                          <div key={color.id} className="bg-muted px-2 py-1 rounded text-xs">
                            {color.nameUa}
                          </div>
                        ))}
                      </div>
                      <PaletteItemActions
                        isLoading={isLoading}
                        onRemove={() => handleDeleteWineType(wineType.id)}
                        dataId={wineType.id}
                        onEdit={() => handleToggleForm(wineType.id)}
                        showEditButton={true}
                        isHeader
                      />
                    </div>
                  ) : (
                    currentFormData && (
                      <WineTypeForm
                        formData={currentFormData}
                        onFormDataChange={(field, value) => updateFormData(wineType.id, field, value)}
                        onSave={() => handleSaveWineType(wineType.id)}
                        onCancel={() => handleCancelEdit(wineType.id)}
                        cachedColors={cachedColors}
                        isLoading={isLoading || colorsLoading}
                        mode="edit"
                        hasChanges={hasChanges(wineType.id)}
                      />
                    )
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
      {totalCount > DEFAULT_PAGINATION_LIMIT && <NLTTablePagination limit={filters.limit} offset={filters.offset} totalRows={totalCount || 0} setOffset={onChangePagination} />}
    </Card>
  )
}
