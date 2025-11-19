import { useTranslation } from 'react-i18next'
import { BaseWineColor } from '../../../general/entities/types'
import { CreateWineTasteParams } from '../../entities/types/tastes'
import { useColorForm } from '../../../general/presenters/useColorForm'
import { Input } from '@/UIKit/shadcn/ui/input'
import { ColorPicker } from '@/UIKit/shadcn/ui/color-picker'
import { MultiSelect } from '@/UIKit/shadcn/ui/multi-select'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Plus, Save } from 'lucide-react'

interface TasteFormProps {
  formData: CreateWineTasteParams
  onFormDataChange: (field: keyof CreateWineTasteParams, value: any) => void
  onSave: () => void
  onCancel: () => void
  isLoading?: boolean
  cachedColors: BaseWineColor[]
  mode?: 'create' | 'edit'
}

export const TasteForm: React.FC<TasteFormProps> = ({ formData, onFormDataChange, onSave, onCancel, isLoading = false, cachedColors, mode = 'edit' }) => {
  const { t } = useTranslation('wines')
  const { t: tc } = useTranslation('common')

  const { colorValues, handleColorChange, fetchOptions } = useColorForm({
    cachedColors,
    initialColors: formData.colors || [],
    onColorsChange: colors => onFormDataChange('colors', colors),
  })

  const canSave = formData.nameUa && formData.nameEn && formData.colors.length && !isLoading && formData.colorHex

  const SaveIcon = mode === 'create' ? Plus : Save
  const saveText = isLoading ? tc('button.saving') : mode === 'create' ? tc('button.save') : tc('button.save')

  return (
    <div className="space-y-4 pl-1 pr-1 sm:pl-6 sm:pr-6 pb-2 pt-0 mt-2 transition-all flex-1 bg-muted rounded-t-none rounded-b-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <div>
          <label className="text-sm font-medium mb-2 block">{t('tastes.taste_name_ua')} *</label>
          <Input value={formData.nameUa} onChange={e => onFormDataChange('nameUa', e.target.value)} placeholder={t('tastes.taste_name_ua')} className="w-full" autoFocus />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">{t('tastes.taste_name_en')} *</label>
          <Input value={formData.nameEn} onChange={e => onFormDataChange('nameEn', e.target.value)} placeholder={t('tastes.taste_name_en')} className="w-full" />
        </div>
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium mb-2 block">{t('tastes.base_color')} *</label>
        <div className="flex items-center gap-4">
          <ColorPicker value={formData.colorHex} onChange={color => onFormDataChange('colorHex', color)} />
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
