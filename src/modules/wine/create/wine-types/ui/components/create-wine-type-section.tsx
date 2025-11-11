import { useTranslation } from 'react-i18next'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Input } from '@/UIKit/shadcn/ui/input'
import { Card, CardContent, CardHeader } from '@/UIKit/shadcn/ui/card'
import { Plus, Grape } from 'lucide-react'
import { MultiSelect } from '@/UIKit/shadcn/ui/multi-select'
import { adaptFetchOptions } from '@/lib/utils'
import { useWineOptionsMock } from '../../../general/presenters/useWineOptions'
import { useEffect } from 'react'
import { useColorSelection } from '../../../general/presenters/useColorSelection'
import { CreateWineTypeParams } from '../../entities/types/wine-type'
import { useCreateWineType } from '../../presenters/useCreateWineType'

interface CreateWineTypeSectionProps {
  onCreateWineType: (wineTypeData: CreateWineTypeParams) => void
  isLoading?: boolean
}

export const CreateWineTypeSection = ({ onCreateWineType, isLoading = false }: CreateWineTypeSectionProps) => {
  const { t } = useTranslation('wines')
  const { t: tc } = useTranslation('common')

  const { isExpanded, formData, canCreateWineType, updateFormData, handleCreateWineType, handleCancel, expandForm } = useCreateWineType({
    onCreateWineType,
    isLoading,
  })

  const { fetchColors } = useWineOptionsMock()
  const { selectedColors, colorValues, handleColorChange } = useColorSelection({ fetchColors, initialColors: formData.colors })

  useEffect(() => {
    updateFormData('colors', selectedColors)
  }, [selectedColors])

  if (!isExpanded) {
    return (
      <div className="flex justify-between items-center flex-wrap-reverse sm:flex-nowrap gap-6">
        <h2 className="text-2xl font-bold">{t('types.wine_types')}</h2>
        <Button onClick={expandForm} className="w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          {t('button.add_new_type')}
        </Button>
      </div>
    )
  }

  return (
    <Card className="border-1 border-dashed p-0">
      <CardContent className="md:p-0 sm:p-0">
        <CardHeader className="px-0 py-1 border-none mb-3">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Grape className="w-5 h-5" />
            {t('types.create_new_type')}
          </h3>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="space-y-2">
            <label  className="text-sm font-medium mb-2 block">{t('types.type_name_ua')} *</label>
            <Input value={formData.label} onChange={e => updateFormData('label', e.target.value)} placeholder={t('types.type_name_ua')} className="w-full" autoFocus />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">{t('types.type_name_en')} *</label>
            <Input value={formData.labelEn} onChange={e => updateFormData('labelEn', e.target.value)} placeholder={t('types.type_name_en')} className="w-full" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium mb-2 block">{t('color_wine')} *</label>
          <MultiSelect
            value={colorValues}
            onChange={handleColorChange}
            placeholder={t('flavors.choose_color')}
            searchLabel={t('flavors.search_color')}
            fetchOptions={adaptFetchOptions(fetchColors)}
            mode="multiple"
            disabled={isLoading}
          />
        </div>

        <div className="flex justify-end gap-2 mt-6 flex-col sm:flex-row">
          <Button onClick={handleCancel} variant="outline" disabled={isLoading}>
            {tc('button.cancel')}
          </Button>
          <Button onClick={handleCreateWineType} disabled={!canCreateWineType || isLoading}>
            <Plus className="w-4 h-4" />
            {isLoading ? tc('button.saving') : tc('button.save')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
