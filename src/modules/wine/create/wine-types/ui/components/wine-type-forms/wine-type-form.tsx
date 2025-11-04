import { Card, CardContent, CardHeader } from '@/UIKit/shadcn/ui/card'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Input } from '@/UIKit/shadcn/ui/input'
import { Label } from '@/UIKit/shadcn/ui/label'
import { Plus, Save, Tags } from 'lucide-react'
import { WineType, CreateWineTypeParams } from '../../../entities/types/wine-type'
import { useWineTypeForm } from '../../../presenters/useWineTypeForm'
import { useWineOptionsMock } from '../../../presenters/useWineOptions'
import { MultiSelect } from '@/UIKit/shadcn/ui/multi-select'
import { useTranslation } from 'react-i18next'
import { wineTypeFormConfig } from '../..'

interface WineTypeFormProps {
  mode: 'create' | 'edit'
  wineType?: WineType
  onSubmit: (wineType: WineType | CreateWineTypeParams) => void
  onCancel: () => void
  isLoading: boolean
}

const adaptFetchOptions = (fetchFn: (search?: string) => Promise<{ id: string; label: string }[]>) => {
  return async (search?: string) => {
    const data = await fetchFn(search)
    return data.map(item => ({
      value: item.id,
      label: item.label,
    }))
  }
}

export const WineTypeForm = ({ mode, wineType, onSubmit, onCancel, isLoading }: WineTypeFormProps) => {
  const { t } = useTranslation('wines')
  const { t: tc } = useTranslation('common')

  const {
    formData,
    handleSubmit,
    handleChange,
    canSubmit,
    isLoading: formLoading,
  } = useWineTypeForm({
    initialData: wineType,
    onSubmit: onSubmit as (wineType: WineType) => void,
    isLoading,
  })

  const { fetchColors, fetchAromas, fetchFlavorNotes, fetchFlavorCharacteristics } = useWineOptionsMock()

  const getFetchFunction = (fetchKey: string) => {
    switch (fetchKey) {
      case 'colors':
        return adaptFetchOptions(fetchColors)
      case 'aromas':
        return adaptFetchOptions(fetchAromas)
      case 'flavorNotes':
        return adaptFetchOptions(fetchFlavorNotes)
      case 'flavorCharacteristics':
        return adaptFetchOptions(fetchFlavorCharacteristics)
      default:
        return adaptFetchOptions(fetchColors)
    }
  }

  const title = mode === 'create' ? t('types.create_new_type') : t('types.edit_type')
  const submitText = formLoading ? tc('button.saving') : tc('button.save')
  const SubmitIcon = mode === 'create' ? Plus : Save

  return (
    <Card className="border-1 border-dashed p-0">
      <CardContent className="md:p-0 sm:p-0">
        <CardHeader className="px-0 py-1 border-none mb-3">
          <h3 className="text-lg font-medium flex items-center gap-2">
            {mode === 'create' && <Tags className="w-5 h-5" />}
            {title}
          </h3>
        </CardHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wineTypeFormConfig.fields.map(field => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>
                  {t(field.labelKey)} {field.required && '*'}
                </Label>
                <Input
                  id={field.id}
                  value={formData[field.id as keyof typeof formData] as string}
                  onChange={e => handleChange(field.id as keyof typeof formData, e.target.value)}
                  placeholder={t(field.placeholderKey)}
                  required={field.required}
                  disabled={formLoading}
                />
              </div>
            ))}
          </div>

          {wineTypeFormConfig.multiSelects.map(select => (
            <div key={select.id} className="space-y-2">
              <Label htmlFor={select.id}>
                {t(select.labelKey)} {select.required && '*'}
              </Label>
              <MultiSelect
                value={formData[select.id as keyof typeof formData] as string[]}
                onChange={value => handleChange(select.id as keyof typeof formData, value)}
                placeholder={t(select.placeholderKey)}
                searchLabel={t(select.searchLabelKey)}
                fetchOptions={getFetchFunction(select.fetchKey)}
                mode="multiple"
                disabled={formLoading}
              />
            </div>
          ))}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={formLoading}>
              {tc('button.cancel')}
            </Button>
            <Button type="submit" disabled={formLoading || !canSubmit}>
              <SubmitIcon className="w-4 h-4 mr-2" />
              {submitText}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
