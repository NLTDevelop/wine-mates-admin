import { Input } from '@/UIKit/shadcn/ui/input'
import { MultiSelect } from '@/UIKit/shadcn/ui/multi-select'
// import { LevelManager } from './level-manager'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Plus, Save } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { CreateWineTasteCharacteristicParams, LevelItem } from '../../entities/types/taste-characteristics'
import { BaseWineColor } from '../../../general/entities/types'
import { useColorForm } from '../../../general/presenters/useColorForm'

interface TasteCharacteristicsFormProps {
  formData: CreateWineTasteCharacteristicParams
  onFormDataChange: (field: keyof CreateWineTasteCharacteristicParams, value: any) => void
  onSave: () => void
  onCancel: () => void
  isLoading?: boolean
  cachedColors: BaseWineColor[]
  mode?: 'create' | 'edit'
  hasChanges?: boolean
  levels: LevelItem[]
  setNewLevelItemData: (newLevels: LevelItem[]) => void
  characteristicId: string | number
}

export const TasteCharacteristicsForm: React.FC<TasteCharacteristicsFormProps> = ({
  formData,
  onFormDataChange,
  onSave,
  onCancel,
  isLoading = false,
  cachedColors,
  mode = 'edit',
  hasChanges = true,
  //   levels,
  //   setNewLevelItemData,
}) => {
  const { t } = useTranslation('wines')
  const { t: tc } = useTranslation('common')

  const { colorValues, handleColorChange, fetchOptions } = useColorForm({
    cachedColors,
    initialColors: formData.colors || [],
    onColorsChange: colors => onFormDataChange('colors', colors),
  })

  const canSave =
    mode === 'create' ? formData.nameUa && formData.nameEn && formData.colors.length && !isLoading : formData.nameUa && formData.nameEn && formData.colors.length && hasChanges && !isLoading

  const SaveIcon = mode === 'create' ? Plus : Save
  const saveText = isLoading ? tc('button.saving') : mode === 'create' ? tc('button.save') : tc('button.save')

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">{t('taste_characteristics.characteristic_name_ua')} *</label>
          <Input value={formData.nameUa} onChange={e => onFormDataChange('nameUa', e.target.value)} placeholder={t('taste_characteristics.characteristic_name_ua')} autoFocus />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">{t('taste_characteristics.characteristic_name_en')} *</label>
          <Input value={formData.nameEn} onChange={e => onFormDataChange('nameEn', e.target.value)} placeholder={t('taste_characteristics.characteristic_name_en')} />
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

      {/* <LevelManager
        levels={levels || []}
        onLevelChange={(newLevels: LevelItem[]) => {
          setNewLevelItemData(newLevels)
        }}
      /> */}

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
