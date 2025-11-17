import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { PaletteItemActions } from '@/modules/wine/create/general/ui'

import { BaseWineColor } from '../../../general/entities/types'
import { useTastePalette } from '../../presenters/useTastePalette'
import { CreateTasteSection } from './create-taste-section'
import { TasteForm } from './taste-form'
import { cn } from '@/lib/utils'

interface TastePaletteManagerProps {
  cachedColors: BaseWineColor[]
  colorsLoading?: boolean
}

export const TastePaletteManager = ({ cachedColors, colorsLoading = false }: TastePaletteManagerProps) => {
  const { tastes, isLoading, isFormOpen, handleAddTaste, handleDeleteTaste, handleToggleForm, handleCancelEdit, formData, updateFormData, handleSaveTaste } = useTastePalette()

  return (
    <Card>
      <CardContent className="space-y-2 sm:space-y-6 max-sm:p-0 sm:p-0">
        <div>
          <CreateTasteSection onCreateTaste={handleAddTaste} isLoading={isLoading} cachedColors={cachedColors} />
        </div>
        <div className="mx-auto flex flex-col justify-center gap-2 w-full">
          {tastes?.map(taste => {
            const isEditing = isFormOpen[taste.id] || false
            const currentFormData = formData[taste.id]

            return (
              <div key={taste.id} className={cn('border-1 border-input rounded-md transition-all cursor-default', isEditing && 'rounded-b-none')} style={{ backgroundColor: taste.value }}>
                <div className="p-2">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex gap-2 sm:flex-row flex-col sm:w-auto w-full">
                      <span className="font-medium">
                        {taste.nameUa} ({taste.nameEn})
                      </span>
                      <div className='flex sm:gap-2 gap-1 sm:flex-row flex-col sm:w-auto w-full'>
                        {taste.colors?.map(color => (
                          <div key={color.id} className="bg-muted px-2 py-1 rounded text-xs" >
                            {color.nameUa}
                          </div>
                        ))}
                      </div>
                    </div>
                    <PaletteItemActions isLoading={isLoading} onRemove={() => handleDeleteTaste(taste.id)} dataId={taste.id} onEdit={() => handleToggleForm(taste.id)} showEditButton={true} isHeader />
                  </div>

                  {isEditing && currentFormData && (
                    <TasteForm
                      formData={currentFormData}
                      onFormDataChange={(field, value) => updateFormData(taste.id, field, value)}
                      onSave={() => handleSaveTaste(taste.id)}
                      onCancel={() => handleCancelEdit(taste.id)}
                      cachedColors={cachedColors}
                      isLoading={isLoading || colorsLoading}
                      mode="edit"
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
