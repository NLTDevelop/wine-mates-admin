import { useTranslation } from 'react-i18next'
import { useTranslationsName } from '../../../general/presenters/useTranslationName'
import { ColorPicker } from '@/UIKit/shadcn/ui/color-picker'
import { Input } from '@/UIKit/shadcn/ui/input'
import { NameDictionary } from '../../../general/entities/types'
import { AdditionalTranslations } from '../../../general/ui/components/additional-translations'

interface ColorFormData {
  translations: NameDictionary[]
  tonePale: string
  toneMedium: string
  toneDeep: string
  colorHex: string
}

interface ColorFormProps {
  data: ColorFormData
  onDataChange: (field: keyof ColorFormData, value: string | NameDictionary[]) => void
  autoFocus?: boolean
  baseColor: string
}

export const ColorForm: React.FC<ColorFormProps> = ({ data, onDataChange, autoFocus = false }) => {
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
    initialTranslations: data.translations || [],
    onTranslationsChange: translations => onDataChange('translations', translations),
  })

  const handleMainColorChange = (color: string) => {
    const shouldResetTones = data.colorHex !== color && (data.tonePale || data.toneMedium || data.toneDeep)

    if (shouldResetTones) {
      onDataChange('tonePale', '')
      onDataChange('toneMedium', '')
      onDataChange('toneDeep', '')
      onDataChange('colorHex', color)
    } else {
      onDataChange('colorHex', color)
    }
  }

  return (
    <div className="border-1 border-input py-2 rounded-b-md bg-muted w-full">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">{t('colors.shade_name_ua')} *</label>
            <Input value={nameUa} onChange={e => handleNameUaChange(e.target.value)} placeholder={t('colors.shade_name_ua')} className="w-full" autoFocus={autoFocus} />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">{t('colors.shade_name_en')} *</label>
            <Input value={nameEn} onChange={e => handleNameEnChange(e.target.value)} placeholder={t('colors.shade_name_en')} className="w-full" />
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
        <TonePicker label={t('colors.main_tone') + ' *'} value={data.colorHex} onChange={handleMainColorChange} isInline />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TonePicker label={t('pale_tone') + ' *'} value={data.tonePale} onChange={color => onDataChange('tonePale', color)} baseHexNoHash={data.colorHex} />
          <TonePicker label={t('medium_tone') + ' *'} value={data.toneMedium} onChange={color => onDataChange('toneMedium', color)} baseHexNoHash={data.colorHex} />
          <TonePicker label={t('deep_tone') + ' *'} value={data.toneDeep} onChange={color => onDataChange('toneDeep', color)} baseHexNoHash={data.colorHex} />
        </div>
      </div>
    </div>
  )
}

interface TonePickerProps {
  label: string
  value?: string
  onChange: (color: string) => void
  baseHexNoHash?: string
  isInline?: boolean
}

const TonePicker = ({ label, value, onChange, baseHexNoHash, isInline = false }: TonePickerProps) => (
  <div className="space-y-3">
    <label className="text-sm font-medium mb-2 block">{label}</label>
    <ColorPicker value={value || ''} onChange={onChange} baseHexNoHash={baseHexNoHash} isInline={isInline} />
  </div>
)
