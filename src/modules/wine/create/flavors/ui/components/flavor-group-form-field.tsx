import { useTranslation } from 'react-i18next'
import { Input } from '@/UIKit/shadcn/ui/input'
import { MultiSelect } from '@/UIKit/shadcn/ui/multi-select'
import { ColorPicker } from '@/UIKit/shadcn/ui/color-picker'
import { adaptFetchOptions } from '@/lib/utils'
import { useWineOptionsMock } from '../../../general/presenters/useWineOptions'
import { useColorSelection } from '../../../general/presenters/useColorSelection'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { CreateWineAromaGroupParams } from '../../entities/types/flavor-types'
import { BaseWineColor } from '../../../general/entities/types'

interface FlavorGroupFormFieldsProps {
  formData: Partial<CreateWineAromaGroupParams>
  onFormDataChange: (field: 'nameUa' | 'nameEn' | 'colors' | 'colorHex', value: string | BaseWineColor[]) => void
  isLoading?: boolean
  autoFocus?: boolean
}

export const FlavorGroupFormFields = ({ formData, onFormDataChange, isLoading = false, autoFocus = true }: FlavorGroupFormFieldsProps) => {
  const { t } = useTranslation('wines')

  const { fetchColors } = useWineOptionsMock()

  const stableFetchColors = useCallback(() => fetchColors(), [])

  const { selectedColors, colorValues, handleColorChange } = useColorSelection({
    fetchColors: stableFetchColors,
    initialColors: formData.colors || [],
  })

  const stableFetchOptions = useMemo(() => {
    return adaptFetchOptions(stableFetchColors)
  }, [stableFetchColors])

  const prevSelectedColorsRef = useRef(selectedColors)

  useEffect(() => {
    const hasChanged = JSON.stringify(selectedColors) !== JSON.stringify(prevSelectedColorsRef.current)

    if (hasChanged) {
      onFormDataChange('colors', selectedColors)
      prevSelectedColorsRef.current = selectedColors
    }
  }, [selectedColors, onFormDataChange])

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
          fetchOptions={stableFetchOptions}
          mode="multiple"
          disabled={isLoading}
        />
      </div>
    </div>
  )
}
