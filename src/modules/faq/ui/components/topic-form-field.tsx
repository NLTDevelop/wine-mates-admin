import { useTranslation } from 'react-i18next'
import { Input } from '@/UIKit/shadcn/ui/input'
import { CreateTopicParams } from '../../entities/types/types'
import { NameDictionary } from '@/modules/wine/create/general/entities/types'
import { useTranslationsName } from '@/modules/wine/create/general/presenters/useTranslationName'
import { AdditionalTranslations } from '@/modules/wine/create/general/ui/components/additional-translations'

interface TopicFormFieldsProps {
  formData: Partial<CreateTopicParams>
  onFormDataChange: (field: 'translations', value: string | NameDictionary[]) => void
  autoFocus?: boolean
}

export const TopicFormFields = ({ formData, onFormDataChange, autoFocus = true }: TopicFormFieldsProps) => {
  const { t } = useTranslation('faq')

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
          <label className="text-sm font-medium mb-2 block">{t('topic_name_ua')} *</label>
          <Input value={nameUa} onChange={e => handleNameUaChange(e.target.value)} placeholder={t('topic_name_ua')} className="w-full" autoFocus={autoFocus} />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">{t('topic_name_en')} *</label>
          <Input value={nameEn} onChange={e => handleNameEnChange(e.target.value)} placeholder={t('topic_name_en')} className="w-full" />
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
    </div>
  )
}
