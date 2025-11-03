import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Input } from '@/UIKit/shadcn/ui/input'
import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { Plus } from 'lucide-react'
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
  const [isCreating, setIsCreating] = useState(false)
  const [newCharacteristic, setNewCharacteristic] = useState({
    label: '',
    labelEn: '',
  })

  const handleCreate = async () => {
    if (!newCharacteristic.label.trim()) return

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

  const canCreate = newCharacteristic.label.trim().length > 0

  if (!isCreating) {
    return (
      <div className="flex justify-center">
        <Button onClick={() => setIsCreating(true)} variant="outline" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {t('button.add_new_characteristic')}
        </Button>
      </div>
    )
  }

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">{t('taste_characteristics.characteristic_name_ua')} *</label>
              <Input value={newCharacteristic.label} onChange={e => setNewCharacteristic(prev => ({ ...prev, label: e.target.value }))} placeholder={t('taste_characteristics.characteristic_name_ua')} autoFocus />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">{t('taste_characteristics.characteristic_name_en')}</label>
              <Input value={newCharacteristic.labelEn} onChange={e => setNewCharacteristic(prev => ({ ...prev, labelEn: e.target.value }))} placeholder={t('taste_characteristics.characteristic_name_en')} />
            </div>
          </div>

          <LevelManager states={characteristicLevels} onStatesChange={onCharacteristicLevelsChange || (() => {})} />

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreating(false)
                setNewCharacteristic({ label: '', labelEn: '' })
                onCharacteristicLevelsChange?.([])
              }}
            >
              {t('button.cancel')}
            </Button>
            <Button onClick={handleCreate} disabled={!canCreate || isLoading}>
              <Plus className="w-4 h-4 mr-2" />
              {t('button.create')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
