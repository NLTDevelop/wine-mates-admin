import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useWineColors } from '../../../presenters/useWineColors'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Input } from '@/UIKit/shadcn/ui/input'
import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { Plus } from 'lucide-react'
import { ColorPicker } from '../../../../../../UIKit/shadcn/ui/color-picker'
import { PaletteItem } from './palette-item'

export const ColorPaletteManager = () => {
  const { t } = useTranslation('wines')
  const { t: tc } = useTranslation('common')
  const { colors, addColor, removeColor, isLoading } = useWineColors()
  const [newColor, setNewColor] = useState('')
  const [newLabel, setNewLabel] = useState('')

  const handleAddColor = () => {
    if (newColor && newLabel && !colors.find(c => c.value === newColor)) {
      addColor({ value: newColor, label: newLabel })
      setNewColor('')
      setNewLabel('')
    }
  }

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium mb-1 block">{t('color')}</label>
            <ColorPicker value={newColor} onChange={setNewColor} />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium mb-1 block">{t('title')}</label>
            <Input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder={t('entry_title')} />
          </div>
          <Button onClick={handleAddColor} disabled={!newColor || !newLabel || isLoading} className="h-11">
            <Plus className="w-4 h-4" /> {tc('button.add')}
          </Button>
        </div>

        <div className="flex flex-col w-full gap-2">
          {colors.map(color => (
            <PaletteItem key={color.value} data={color} onRemove={removeColor} isLoading={isLoading} isNeedCopy />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
