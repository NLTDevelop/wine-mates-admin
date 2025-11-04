import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Input } from '@/UIKit/shadcn/ui/input'
import { Card, CardContent, CardHeader } from '@/UIKit/shadcn/ui/card'
import { Grape, Plus } from 'lucide-react'
import { CreateWineTasteCharacteristicParams, LevelItem, WineTasteCharacteristics } from '../../entities/types/taste-characteristics'
import { LevelManager } from '..'

interface CreateTasteCharacteristicSectionProps {
  onCreateCharacteristic: (dto: CreateWineTasteCharacteristicParams & { levels?: LevelItem[] }) => Promise<WineTasteCharacteristics | void>
  isLoading?: boolean
  characteristicLevels?: LevelItem[]
  onCharacteristicLevelsChange?: (levels: LevelItem[]) => void
}

export const CreateTasteCharacteristicSection = ({ onCreateCharacteristic, isLoading = false, characteristicLevels = [], onCharacteristicLevelsChange }: CreateTasteCharacteristicSectionProps) => {
  const { t } = useTranslation('wines')
  const { t: tc } = useTranslation('common')

  const [isCreating, setIsCreating] = useState(false)
  const [newCharacteristic, setNewCharacteristic] = useState({
    label: '',
    labelEn: '',
  })

  const handleStartCreating = () => {
    setIsCreating(true)

    const initialLevels = Array.from({ length: 3 }, (_, index) => ({
      id: `state-${Date.now()}-${index}`,
      levelName: '',
      order: index,
    }))

    if (onCharacteristicLevelsChange) {
      onCharacteristicLevelsChange(initialLevels)
    } else {
      console.error('onCharacteristicLevelsChange is not defined!')
    }
  }

  const handleCreate = async () => {
    if (!newCharacteristic.label.trim()) {
      return
    }

    try {
      await onCreateCharacteristic({
        label: newCharacteristic.label,
        labelEn: newCharacteristic.labelEn,
        levels: characteristicLevels.filter(state => state.levelName.trim() !== ''),
      })
      setNewCharacteristic({ label: '', labelEn: '' })
      onCharacteristicLevelsChange?.([])
      setIsCreating(false)
    } catch (error) {
      console.error('Failed to create characteristic:', error)
    }
  }

  const canCreate =
    newCharacteristic.label.trim().length > 0 && newCharacteristic.labelEn.trim().length > 0 && characteristicLevels.length > 0 && characteristicLevels.every(c => c.levelName.trim() !== '')

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
              <Input
                value={newCharacteristic.label}
                onChange={e => setNewCharacteristic(prev => ({ ...prev, label: e.target.value }))}
                placeholder={t('taste_characteristics.characteristic_name_ua')}
                autoFocus
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">{t('taste_characteristics.characteristic_name_en')}</label>
              <Input
                value={newCharacteristic.labelEn}
                onChange={e => setNewCharacteristic(prev => ({ ...prev, labelEn: e.target.value }))}
                placeholder={t('taste_characteristics.characteristic_name_en')}
              />
            </div>
          </div>

          <LevelManager states={characteristicLevels} onStatesChange={onCharacteristicLevelsChange || (() => {})} />
          <div className="flex justify-end gap-2 flex-col sm:flex-row">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreating(false)
                setNewCharacteristic({ label: '', labelEn: '' })
                onCharacteristicLevelsChange?.([])
              }}
            >
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
