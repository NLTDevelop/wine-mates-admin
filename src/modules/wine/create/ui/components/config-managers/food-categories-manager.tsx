import { useState } from 'react'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Input } from '@/UIKit/shadcn/ui/input'
import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { Plus } from 'lucide-react'
import { useFoodCategories } from '../../../presenters/useFoodCategories'
import { useTranslation } from 'react-i18next'
import { PaletteItem } from './palette-item'

export const FoodCategoriesManager = () => {
  const { t } = useTranslation('wines')
  const { t: tc } = useTranslation('common')

  const { categories, addCategory, removeCategory, isLoading } = useFoodCategories()
  const [newLabel, setNewLabel] = useState('')
  const [newItems, setNewItems] = useState('')

  const handleAddCategory = () => {
    if (newLabel.trim()) {
      const items = newItems
        .split(',')
        .map(item => item.trim())
        .filter(Boolean)

      addCategory(
        {
          label: newLabel.trim(),
          items: items.length > 0 ? items : undefined,
        },
        {
          onSuccess: () => {
            setNewLabel('')
            setNewItems('')
          },
        }
      )
    }
  }

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">{t('category_name')}</label>
              <Input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder={t('entry_category_name')} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">{t('food_items')}</label>
              <Input value={newItems} onChange={e => setNewItems(e.target.value)} placeholder={t('entry_food_items')} />
            </div>
          </div>

          <div className="text-end">
            <Button onClick={handleAddCategory} disabled={!newLabel.trim() || isLoading}>
              <Plus className="w-4 h-4 mr-1" />
              {tc('button.save')}
            </Button>
          </div>
        </div>

        <div className="flex flex-col w-full gap-2">
          {categories.map(category => (
            <PaletteItem key={category.value} data={category} onRemove={removeCategory} isLoading={isLoading} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
