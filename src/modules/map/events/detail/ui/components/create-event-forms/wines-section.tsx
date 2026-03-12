import React, { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormField, FormMessage } from '@/UIKit/shadcn/ui/form'
import { Check, Search } from 'lucide-react'
import { Input } from '@/UIKit/shadcn/ui/input'
import { WineItem } from '../../../../entities/types'
import { EventFormData } from '@/modules/map/events/detail/presenters/event-form-schema'

interface WinesSectionProps {
  form: UseFormReturn<EventFormData>
  wines: WineItem[]
}

//todo : must be multiselect
export const WinesSection: React.FC<WinesSectionProps> = ({ form, wines }) => {
  const { t } = useTranslation('events')
  const [searchTerm, setSearchTerm] = useState('')
  const selectedWines = form.watch('wineSet') || []

  const filteredWines = wines.filter(wine => wine.name.toLowerCase().includes(searchTerm.toLowerCase()) || wine.producer?.toLowerCase().includes(searchTerm.toLowerCase()))

  const toggleWine = (wineId: number) => {
    const current = selectedWines
    const updated = current.includes(wineId) ? current.filter(id => id !== wineId) : [...current, wineId]
    form.setValue('wineSet', updated, { shouldValidate: true })
  }

  const totalWinePrice = selectedWines.reduce((sum, id) => {
    const wine = wines.find(w => w.id === id)
    return sum + (wine?.price || 0)
  }, 0)

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold border-b pb-2">{t('wines_in_set')}</h2>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input placeholder={t('search_wines')} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" />
      </div>

      <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto border rounded-md p-3">
        {filteredWines.map(wine => (
          <div
            key={wine.id}
            className={`
              flex items-center justify-between p-3 rounded-md cursor-pointer
              ${selectedWines.includes(wine.id) ? 'bg-purple-100 border-purple-300' : 'hover:bg-gray-50 border-transparent'} border
            `}
            onClick={() => toggleWine(wine.id)}
          >
            <div>
              <p className="font-medium text-sm">{wine.name}</p>
              <p className="text-xs text-gray-500">
                {wine.producer} {wine.year && `(${wine.year})`}
              </p>
              {wine.price && <p className="text-xs text-gray-600 mt-1">{wine.price} грн</p>}
            </div>
            {selectedWines.includes(wine.id) && <Check className="h-4 w-4 text-purple-600" />}
          </div>
        ))}
      </div>

      {selectedWines.length > 0 && (
        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
          <span className="text-sm text-gray-600">
            {t('selected_wines')}: <span className="font-bold">{selectedWines.length}</span>
          </span>
          <span className="text-sm text-gray-600">
            {t('total_price')}:{' '}
            <span className="font-bold">
              {totalWinePrice} {form.watch('currency')}
            </span>
          </span>
        </div>
      )}

      <FormField control={form.control} name="wineSet" render={() => <FormMessage />} />
    </div>
  )
}
