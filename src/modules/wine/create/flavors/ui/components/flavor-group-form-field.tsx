import { useTranslation } from 'react-i18next'
import { useColorForm } from '../../../general/presenters/useColorForm'
import { useTranslationsName } from '../../../general/presenters/useTranslationName'
import { Input } from '@/UIKit/shadcn/ui/input'
import { MultiSelect } from '@/UIKit/shadcn/ui/multi-select'
import { ColorPicker } from '@/UIKit/shadcn/ui/color-picker'
import { CreateWineAromaGroupParams } from '../../entities/types/flavor-types'
import { BaseWineColor, NameDictionary } from '../../../general/entities/types'
import { AdditionalTranslations } from '../../../general/ui/components/additional-translations'

import { mockBaseWineColors } from '../../../general/entities/mockBaseColor'

interface FlavorGroupFormFieldsProps {
  formData: Partial<CreateWineAromaGroupParams>
  onFormDataChange: (field: 'translations' | 'colors' | 'colorHex', value: string | BaseWineColor[] | NameDictionary[]) => void
  isLoading?: boolean
  autoFocus?: boolean
  cachedColors: BaseWineColor[]
}

export const FlavorGroupFormFields = ({ formData, onFormDataChange, isLoading = false, autoFocus = true /*cachedColors*/ }: FlavorGroupFormFieldsProps) => {
  const { t } = useTranslation('wines')

  const { colorValues, handleColorChange, fetchOptions } = useColorForm({
    cachedColors: mockBaseWineColors, //временно мок
    initialColors: formData.colors || [],
    onColorsChange: colors => onFormDataChange('colors', colors),
  })

  const {
    nameUa,
    nameEn,
    additionalTranslations,
    handleNameUaChange,
    handleNameEnChange,
    handleAddTranslation,
    handleRemoveTranslation,
    handleLanguageChange,
    handleTranslationValueChange,
    getAvailableLanguages,
  } = useTranslationsName({
    initialTranslations: formData.translations || [],
    onTranslationsChange: translations => onFormDataChange('translations', translations),
  })

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <div>
          <label className="text-sm font-medium mb-2 block">{t('flavors.group_name_ua')} *</label>
          <Input value={nameUa} onChange={e => handleNameUaChange(e.target.value)} placeholder={t('flavors.group_name_ua')} className="w-full" autoFocus={autoFocus} />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">{t('flavors.group_name_en')} *</label>
          <Input value={nameEn} onChange={e => handleNameEnChange(e.target.value)} placeholder={t('flavors.group_name_en')} className="w-full" />
        </div>
      </div>

      <AdditionalTranslations
        additionalTranslations={additionalTranslations}
        onAddTranslation={handleAddTranslation}
        onRemoveTranslation={handleRemoveTranslation}
        onLanguageChange={handleLanguageChange}
        onTranslationValueChange={handleTranslationValueChange}
        getAvailableLanguages={getAvailableLanguages}
      />

      <div className="my-3">
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
