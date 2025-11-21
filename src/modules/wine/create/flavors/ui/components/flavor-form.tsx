import { Input } from '@/UIKit/shadcn/ui/input'
import { NameDictionary } from '../../../general/entities/types'
import { AdditionalTranslations } from '../../../general/ui/components/additional-translations'
import { useTranslationsName } from '../../../general/presenters/useTranslationName'
import { ColorPicker } from '@/UIKit/shadcn/ui/color-picker'
import { useTranslation } from 'react-i18next'

interface FlavorFormData {
  // name: string
  // nameEn: string
  translations: NameDictionary[]
  colorHex: string
}

interface FlavorFormProps {
  data: FlavorFormData
  onDataChange: (field: keyof FlavorFormData, value: string | NameDictionary[]) => void
  nameLabel: string
  nameEnLabel: string
  namePlaceholder: string
  nameEnPlaceholder: string
  autoFocus?: boolean
}

export const FlavorForm: React.FC<FlavorFormProps> = ({ data, onDataChange, nameLabel, nameEnLabel, namePlaceholder, nameEnPlaceholder, autoFocus = false }) => {
  const { t } = useTranslation('wines')
  // -----------------------

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
    initialTranslations: data.translations || [],
    onTranslationsChange: translations => onDataChange('translations', translations),
  })
  // -----------------------

  return (
    <div className="border-1 border-input py-2 rounded-b-md bg-muted w-full">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">{nameLabel} *</label>
            <Input value={nameUa} onChange={e => handleNameUaChange(e.target.value)} placeholder={namePlaceholder} className="w-full" autoFocus={autoFocus} />
            {/* <Input value={data.name} onChange={e => onDataChange('name', e.target.value)} placeholder={namePlaceholder} className="w-full" autoFocus={autoFocus} /> */}
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">{nameEnLabel} *</label>
            <Input value={nameEn} onChange={e => handleNameEnChange(e.target.value)} placeholder={nameEnPlaceholder} className="w-full" />
            {/* <Input value={data.nameEn} onChange={e => onDataChange('nameEn', e.target.value)} placeholder={nameEnPlaceholder} className="w-full" /> */}
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
          <label className="text-sm font-medium mb-2 block">{t('flavors.subgroup_color')} *</label>
          <div className="flex items-center gap-4">
            <ColorPicker value={data.colorHex || ''} onChange={color => onDataChange('colorHex', color)} />
          </div>
        </div>
      </div>
    </div>
  )
}
