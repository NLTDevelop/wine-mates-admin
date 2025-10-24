import { useState } from 'react'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Input } from '@/UIKit/shadcn/ui/input'
import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { Plus } from 'lucide-react'
import { useWineSmells } from '../../../presenters/useWineSmells'
import { useTranslation } from 'react-i18next'
import { PaletteItem } from './palette-item'
import { ColorPicker } from '@/UIKit/shadcn/ui/color-picker'

export const SmellPaletteManager = () => {
  const { t } = useTranslation('wines')
  const { t: tc } = useTranslation('common')

  const { smells, addSmell, removeSmell, isLoading } = useWineSmells()

  const [newColor, setNewColor] = useState('')
  const [newLabel, setNewLabel] = useState('')
  const [newItems, setNewItems] = useState('')

  const handleAddSmell = () => {
    if (newColor && newLabel) {
      const items = newItems
        .split(',')
        .map(item => item.trim())
        .filter(Boolean)
      addSmell({
        value: newColor,
        label: newLabel,
        items: items.length > 0 ? items : undefined,
      })
      setNewColor('')
      setNewLabel('')
      setNewItems('')
    }
  }

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">{t('color')}</label>
              <ColorPicker value={newColor} onChange={setNewColor} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">{t('title')}</label>
              <Input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder={t('entry_smell_title')} />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">{t('smell')}</label>
            <Input value={newItems} onChange={e => setNewItems(e.target.value)} placeholder={t('entry_smells')} />
          </div>
          <div className="text-end">
            <Button onClick={handleAddSmell} disabled={!newColor || !newLabel || isLoading}>
              <Plus className="w-4 h-4 mr-1" />
              {tc('button.save')}
            </Button>
          </div>
        </div>

        <div className="flex flex-col w-full gap-2">
          {smells.map(smell => (
            <PaletteItem key={smell.value} data={smell} onRemove={removeSmell} isLoading={isLoading} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
