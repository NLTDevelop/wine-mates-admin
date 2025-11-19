import { useTranslation } from 'react-i18next'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Input } from '@/UIKit/shadcn/ui/input'
import { Card, CardContent, CardHeader } from '@/UIKit/shadcn/ui/card'
import { Grape, Plus } from 'lucide-react'
import { LevelManager } from '..'
import { MultiSelect } from '@/UIKit/shadcn/ui/multi-select'
import { adaptFetchOptions } from '@/lib/utils'
import { useWineOptions } from '../../../general/presenters/useWineOptions'
import { useCreateTasteCharacteristic } from '../../presenters/useCreateTasteCharacteristic'

interface CreateTasteCharacteristicSectionProps {
  onCreateCharacteristic: (dto: any) => Promise<any>
  isLoading?: boolean
  characteristicLevels?: any[]
  onCharacteristicLevelsChange?: (levels: any[]) => void
}

export const CreateTasteCharacteristicSection = ({ onCreateCharacteristic, isLoading = false, characteristicLevels = [], onCharacteristicLevelsChange }: CreateTasteCharacteristicSectionProps) => {
  const { t } = useTranslation('wines')
  const { t: tc } = useTranslation('common')
  const { fetchColors } = useWineOptions()

  const { isCreating, newCharacteristic, colorValues, canCreate, handleStartCreating, handleCreate, handleCancel, updateCharacteristic, handleColorChange } = useCreateTasteCharacteristic({
    onCreateCharacteristic,
    isLoading,
    characteristicLevels,
    onCharacteristicLevelsChange,
    fetchColors,
  })

  if (!isCreating) {
    return (
      <div className="flex justify-between items-center flex-wrap-reverse sm:flex-nowrap gap-6">
        <h2 className="text-2xl font-bold">{t('taste_characteristics.characteristics')}</h2>
        <Button onClick={handleStartCreating} className="w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          {t('button.add_new_characteristic')}
        </Button>
      </div>
    )
  }

  return (
    <Card className="border-1 border-dashed p-0">
      <CardContent className="md:p-0 sm:p-0">
        <CardHeader className="px-0 py-1 border-none mb-3">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Grape className="w-5 h-5" />
            {t('taste_characteristics.create_new_taste')}
          </h3>
        </CardHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">{t('taste_characteristics.characteristic_name_ua')} *</label>
              <Input value={newCharacteristic.nameUa} onChange={e => updateCharacteristic('nameUa', e.target.value)} placeholder={t('taste_characteristics.characteristic_name_ua')} autoFocus />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">{t('taste_characteristics.characteristic_name_en')}</label>
              <Input value={newCharacteristic.nameEn} onChange={e => updateCharacteristic('nameEn', e.target.value)} placeholder={t('taste_characteristics.characteristic_name_en')} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">{t('color_wine')} *</label>
            <MultiSelect
              value={colorValues}
              onChange={handleColorChange}
              placeholder={t('flavors.choose_color')}
              searchLabel={t('flavors.search_color')}
              fetchOptions={adaptFetchOptions(fetchColors)}
              mode="multiple"
              disabled={isLoading}
            />
          </div>

          <LevelManager states={characteristicLevels} onStatesChange={onCharacteristicLevelsChange || (() => {})} />

          <div className="flex justify-end gap-2 flex-col sm:flex-row">
            <Button variant="outline" onClick={handleCancel}>
              {tc('button.cancel')}
            </Button>
            <Button onClick={handleCreate} disabled={!canCreate || isLoading}>
              <Plus className="w-4 h-4" />
              {isLoading ? tc('button.saving') : tc('button.save')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
