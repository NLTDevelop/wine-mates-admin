import { useTranslation } from 'react-i18next'
import { Input } from '@/UIKit/shadcn/ui/input'
import { MultiSelect } from '@/UIKit/shadcn/ui/multi-select'
import { ColorPicker } from '@/UIKit/shadcn/ui/color-picker'
import { CreateWineAromaGroupParams } from '../../entities/types/flavor-types'
import { BaseWineColor } from '../../../general/entities/types'
import { useColorForm } from '../../../general/presenters/useColorForm'

interface FlavorGroupFormFieldsProps {
  formData: Partial<CreateWineAromaGroupParams>
  onFormDataChange: (field: 'nameUa' | 'nameEn' | 'colors' | 'colorHex', value: string | BaseWineColor[]) => void
  isLoading?: boolean
  autoFocus?: boolean
  cachedColors: BaseWineColor[]
}

export const FlavorGroupFormFields = ({ formData, onFormDataChange, isLoading = false, autoFocus = true, cachedColors }: FlavorGroupFormFieldsProps) => {
  const { t } = useTranslation('wines')

  const { colorValues, handleColorChange, fetchOptions } = useColorForm({
    cachedColors,
    initialColors: formData.colors || [],
    onColorsChange: colors => onFormDataChange('colors', colors),
  })

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <div>
          <label className="text-sm font-medium mb-2 block">{t('flavors.group_name_ua')} *</label>
          <Input value={formData.nameUa || ''} onChange={e => onFormDataChange('nameUa', e.target.value)} placeholder={t('flavors.group_name_ua')} className="w-full" autoFocus={autoFocus} />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">{t('flavors.group_name_en')} *</label>
          <Input value={formData.nameEn || ''} onChange={e => onFormDataChange('nameEn', e.target.value)} placeholder={t('flavors.group_name_en')} className="w-full" />
        </div>
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium mb-2 block">{t('tastes.base_color')} *</label>
        <div className="flex items-center gap-4">
          <ColorPicker value={formData.colorHex || ''} onChange={color => onFormDataChange('colorHex', color)} />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium mb-2 block">{t('color_wine')} *</label>
        <MultiSelect
          value={colorValues}
          onChange={handleColorChange}
          placeholder={t('flavors.choose_color')}
          searchLabel={t('flavors.search_color')}
          fetchOptions={fetchOptions}
          mode="multiple"
          disabled={isLoading}
        />
      </div>
    </div>
  )
}
