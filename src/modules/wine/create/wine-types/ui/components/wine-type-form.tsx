import { Input } from '@/UIKit/shadcn/ui/input'
import { MultiSelect } from '@/UIKit/shadcn/ui/multi-select'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Save, Plus, Tags } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { CreateWineTypeParams } from '../../entities/types/wine-type'
import { BaseWineColor } from '../../../general/entities/types'
import { useColorForm } from '../../../general/presenters/useColorForm'
import { useTranslationsName } from '../../../general/presenters/useTranslationName'
import { AdditionalTranslations } from '../../../general/ui/components/additional-translations'
import { mockBaseWineColors } from '../../../general/entities/mockBaseColor'

interface WineTypeFormProps {
  formData: CreateWineTypeParams
  onFormDataChange: (field: keyof CreateWineTypeParams, value: any) => void
  onSave: () => void
  onCancel: () => void
  isLoading?: boolean
  cachedColors: BaseWineColor[]
  mode?: 'create' | 'edit'
  hasChanges?: boolean
}

export const WineTypeForm: React.FC<WineTypeFormProps> = ({ formData, onFormDataChange, onSave, onCancel, isLoading = false, /*cachedColors,*/ mode = 'edit', hasChanges = true }) => {
  const { t } = useTranslation('wines')
  const { t: tc } = useTranslation('common')

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

 const canSave =
  mode === 'create'
    ? nameUa && nameEn && formData.colors.length && !isLoading
    : nameUa && nameEn && formData.colors.length && hasChanges && !isLoading

  const SaveIcon = mode === 'create' ? Plus : Save
  const saveText = isLoading ? tc('button.saving') : mode === 'create' ? tc('button.save') : tc('button.save')

  return (
    <div className="space-y-4">
      {mode !== 'create' ? (
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Tags className="w-5 h-5" />
          {t('types.edit_type')}
        </h3>
      ) : null}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium mb-2 block">{t('types.type_name_ua')} *</label>
          <Input value={nameUa} onChange={e => handleNameUaChange(e.target.value)} placeholder={t('types.type_name_ua')} className="w-full" autoFocus />
          {/* <Input value={formData.nameUa} onChange={e => onFormDataChange('nameUa', e.target.value)} placeholder={t('types.type_name_ua')} className="w-full" autoFocus /> */}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium mb-2 block">{t('types.type_name_en')} *</label>
          <Input value={nameEn} onChange={e => handleNameEnChange(e.target.value)} placeholder={t('types.type_name_en')} className="w-full" />
          {/* <Input value={formData.nameEn} onChange={e => onFormDataChange('nameEn', e.target.value)} placeholder={t('types.type_name_en')} className="w-full" /> */}
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

      <div className="flex gap-3 justify-end mt-4">
        <Button size="sm" variant="ghost" className="border-1 hover:bg-muted-foreground hover:text-input" onClick={onCancel} disabled={isLoading}>
          {tc('button.cancel')}
        </Button>
        <Button size="sm" onClick={onSave} disabled={!canSave}>
          <SaveIcon className="w-4 h-4" />
          {saveText}
        </Button>
      </div>
    </div>
  )
}
