import { useTranslation } from 'react-i18next'
import { Input } from '@/UIKit/shadcn/ui/input'
import { ColorPicker } from '@/UIKit/shadcn/ui/color-picker'
import { CreateWineColorParams } from '../../entities/types/color-types'
import { NameDictionary } from '../../../general/entities/types'
import { AdditionalTranslations } from '../../../general/ui/components/additional-translations'
import { useTranslationsName } from '../../../general/presenters/useTranslationName'

interface ColorGroupFormFieldsProps {
  formData: Partial<CreateWineColorParams>
  onFormDataChange: (field: /*'nameUa' | 'nameEn'*/'translations' | 'colorHex', value: string | NameDictionary[]) => void
  isLoading?: boolean
  autoFocus?: boolean
}

export const ColorGroupFormFields = ({ formData, onFormDataChange, autoFocus = true }: ColorGroupFormFieldsProps) => {
  const { t } = useTranslation('wines')

  // -----------------------------
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
    getAvailableLanguages
  } = useTranslationsName({
    initialTranslations: formData.translations || [],
    onTranslationsChange: (translations) => onFormDataChange('translations', translations)
  })

  // ---------------------------------

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <div>
          <label className="text-sm font-medium mb-2 block">{t('colors.color_name_ua')} *</label>
          {/* <Input value={formData.nameUa || ''} onChange={e => onFormDataChange('nameUa', e.target.value)} placeholder={t('colors.color_name_ua')} className="w-full" autoFocus={autoFocus} /> */}
          <Input value={nameUa} onChange={e => handleNameUaChange(e.target.value)} placeholder={t('colors.color_name_ua')} className="w-full" autoFocus={autoFocus} />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">{t('colors.color_name_en')} *</label>
          {/* <Input value={formData.nameEn || ''} onChange={e => onFormDataChange('nameEn', e.target.value)} placeholder={t('colors.color_name_en')} className="w-full" /> */}
          <Input value={nameEn} onChange={e => handleNameEnChange(e.target.value)} placeholder={t('colors.color_name_en')} className="w-full" />
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

      <div className="my-2">
        <label className="text-sm font-medium mb-2 block">{t('colors.base_color')} *</label>
        <div className="flex items-center gap-4">
          <ColorPicker value={formData.colorHex || ''} onChange={color => onFormDataChange('colorHex', color)} />
        </div>
      </div>
    </div>
  )
}
