import { useTranslation } from 'react-i18next'
import { Input } from '@/UIKit/shadcn/ui/input'
import { ColorPicker } from '@/UIKit/shadcn/ui/color-picker'
import { BaseWineColor, Language, NameDescriptionDictionary, NameDictionary } from '../../../general/entities/types'
import { AdditionalTranslations } from '../../../general/ui/components/additional-translations'
import { AdditionalDescriptionTranslations } from '../../../general/ui/components/additional-description-translations'
import { CreateWineTasteCharacteristicParams, LevelItem } from '../../entities/taste-characteristics'
import { Textarea } from '@/UIKit/shadcn/ui/textarea'
import { LevelsManager } from '..'
import { useTranslationsDescription } from '../../../general/presenters/useTranslationsDescription'
import { extractDescriptionsFromTranslations, extractNamesFromTranslations, mergeTranslations } from '../../../general/presenters/helper'
import { useTranslationsName } from '../../../general/presenters/useTranslationName'
import { LevelSwitcher } from './level-switcher'

interface CharacteristicFormFieldsProps {
  formData: Partial<CreateWineTasteCharacteristicParams>
  onFormDataChange: (field: 'translations' | 'colorHex' | 'levels' | 'qtyLevels', value: NameDescriptionDictionary[][] | BaseWineColor[] | string | LevelItem[] | number) => void
  autoFocus?: boolean
  onReorder?: (reorderedLevels: LevelItem[]) => void
}

export const CharacteristicFormFields = ({ formData, onFormDataChange, autoFocus = true, onReorder }: CharacteristicFormFieldsProps) => {
  const { t } = useTranslation('wines')

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
    initialTranslations: extractNamesFromTranslations(formData?.translations || []),
    onTranslationsChange: (translations: NameDictionary[]) => {
      const updatedTranslations = mergeTranslations(translations, extractDescriptionsFromTranslations(formData?.translations || []))
      onFormDataChange('translations', updatedTranslations)
    },
  })

  const usedNameLanguages: Language[] = [
    ...(nameUa ? ['uk' as Language] : []),
    ...(nameEn ? ['en' as Language] : []),
    ...additionalTranslations.filter(t => t.language).map(t => t.language as Language),
  ]

  const {
    descriptionUa,
    descriptionEn,
    additionalDescriptions,
    handleDescriptionUaChange,
    handleDescriptionEnChange,
    handleAddDescription,
    handleRemoveDescription,
    handleDescriptionLanguageChange,
    handleDescriptionValueChange,
    getAvailableDescriptionLanguages,
  } = useTranslationsDescription({
    initialTranslations: formData?.translations || [],
    additionalNameLanguages: usedNameLanguages,
    onTranslationsChange: (descriptions: NameDescriptionDictionary[][]) => {
      const updatedTranslations = mergeTranslations(extractNamesFromTranslations(formData?.translations || []), descriptions)
      onFormDataChange('translations', updatedTranslations)
    },
  })

  const handleQtyLevelsChange = (qtyLevels: 2 | 3) => {
    onFormDataChange('qtyLevels', qtyLevels)
  }

  return (
    <div className="w-full space-y-6 pt-4">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">{t('taste_characteristics.characteristic_name_ua')} *</label>
            <Input value={nameUa} onChange={e => handleNameUaChange(e.target.value)} placeholder={t('taste_characteristics.characteristic_name_ua')} className="w-full" autoFocus={autoFocus} />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">{t('taste_characteristics.characteristic_name_en')} *</label>
            <Input value={nameEn} onChange={e => handleNameEnChange(e.target.value)} placeholder={t('taste_characteristics.characteristic_name_en')} className="w-full" />
          </div>
        </div>

        <AdditionalTranslations
          additionalTranslations={additionalTranslations}
          onAddTranslation={handleAddTranslation}
          onRemoveTranslation={handleRemoveTranslation}
          onLanguageChange={handleLanguageChange}
          onTranslationValueChange={handleTranslationValueChange}
          getAvailableLanguages={getAvailableLanguages}
          isLabel={false}
        />
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">{t('taste_characteristics.characteristic_desc_ua')}</label>
            <Textarea
              value={descriptionUa}
              onChange={e => handleDescriptionUaChange(e.target.value)}
              placeholder={t('taste_characteristics.characteristic_desc_ua')}
              className="min-h-[80px] bg-background"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">{t('taste_characteristics.characteristic_desc_en')}</label>
            <Textarea
              value={descriptionEn}
              onChange={e => handleDescriptionEnChange(e.target.value)}
              placeholder={t('taste_characteristics.characteristic_desc_en')}
              className="min-h-[80px] bg-background"
            />
          </div>
        </div>

        <AdditionalDescriptionTranslations
          additionalDescriptions={additionalDescriptions}
          onAddDescription={handleAddDescription}
          onRemoveDescription={handleRemoveDescription}
          onLanguageChange={handleDescriptionLanguageChange}
          onDescriptionValueChange={handleDescriptionValueChange}
          getAvailableLanguages={getAvailableDescriptionLanguages}
          isLabel={false}
        />
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-2 block">{t('tastes.base_color')} *</label>
          <div className="flex items-center gap-4">
            <ColorPicker value={formData?.colorHex || ''} onChange={color => onFormDataChange('colorHex', color)} />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">{t('taste_characteristics.levels')} *</label>
          <LevelSwitcher value={formData.qtyLevels || 2} onChange={handleQtyLevelsChange} />
          <LevelsManager levels={formData?.levels || []} onLevelsChange={levels => onFormDataChange('levels', levels)} onReorder={onReorder} />
        </div>
      </div>
    </div>
  )
}
