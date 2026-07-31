/* eslint-disable react/react-in-jsx-scope */
/* global URL */
import { useContrastText } from '@/hooks/ui/useContrastText'
import { cn } from '@/lib/utils'
import { Button } from '@/UIKit/shadcn/ui/button'
import { X } from 'lucide-react'
import { useAddWinesStore } from '../../entities/wine-list-store'
import { useTranslation } from 'react-i18next'
import { useAddWineToWinery } from '../../presenters/useAddWineToWinery'
import { useState } from 'react'
import { Input } from '@/UIKit/shadcn/ui/input'
import { Label } from '@/UIKit/shadcn/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/UIKit/shadcn/ui/select'
import { useCurrencyOptions } from '@/modules/events/presenters/useCurrencyOptions'
import { IWines } from '@/modules/wine/list/entities/types/types'

const isValidWebsiteUrl = (value: string) => {
  if (!value) return true

  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol)
  } catch {
    return false
  }
}

export const AddedWines = () => {
  const { t } = useTranslation('winery')
  const { selectedWines, setSelectedWines } = useAddWinesStore()
  const { addWines, isAdding } = useAddWineToWinery()
  const { currencies, isLoading: currenciesLoading } = useCurrencyOptions()
  const [formState, setFormState] = useState({ price: '', currency: 'UAH', quantity: '', websiteUrl: '' })
  const [formError, setFormError] = useState('')

  const currencyOptions = currencies.length ? currencies : ['UAH']

  const handleRemoveWine = (wineId: string) => {
    const updatedWines = selectedWines?.filter(w => w.id !== wineId) || []
    setSelectedWines(updatedWines)
  }

  const hasItems = Boolean(selectedWines?.length)

  const handleAddWines = async () => {
    const price = Number(formState.price)
    const quantity = formState.quantity.trim() ? Number(formState.quantity) : undefined
    const websiteUrl = formState.websiteUrl.trim()

    if (Number.isNaN(price) || price <= 0) {
      setFormError(t('offer.price_required'))
      return
    }

    if (quantity !== undefined && (!Number.isInteger(quantity) || quantity < 0)) {
      setFormError(t('offer.quantity_invalid'))
      return
    }

    if (!isValidWebsiteUrl(websiteUrl)) {
      setFormError(t('offer.link_invalid'))
      return
    }

    setFormError('')
    const isAdded = await addWines({
      price,
      currency: formState.currency || 'UAH',
      ...(quantity !== undefined ? { quantity } : {}),
      ...(websiteUrl ? { websiteUrl } : {}),
    })

    if (isAdded) {
      setFormState({ price: '', currency: 'UAH', quantity: '', websiteUrl: '' })
    }
  }

  return (
    <div
      className={cn('grid transition-[grid-template-rows,padding,margin] duration-300 ease-out', hasItems ? 'grid-rows-[1fr] mb-4 opacity-100' : 'grid-rows-[0fr] mb-0 opacity-0 pointer-events-none')}
    >
      <div className="overflow-hidden rounded-md border border-input bg-muted/20 p-3">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {selectedWines?.map(w => (
              <AddedWineItem key={w.id} wine={w} onRemove={handleRemoveWine} />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-[150px_120px_140px_1fr_auto] md:items-end">
            <div className="space-y-2">
              <Label>{t('offer.price')} *</Label>
              <Input type="number" min="0" step="0.01" value={formState.price} onChange={event => setFormState(prev => ({ ...prev, price: event.target.value }))} placeholder="199.99" />
            </div>

            <div className="space-y-2">
              <Label>{t('offer.currency')} *</Label>
              <Select value={formState.currency} onValueChange={currency => setFormState(prev => ({ ...prev, currency }))} disabled={currenciesLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="UAH" />
                </SelectTrigger>
                <SelectContent>
                  {currencyOptions.map(currency => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t('offer.quantity')}</Label>
              <Input type="number" min="0" step="1" value={formState.quantity} onChange={event => setFormState(prev => ({ ...prev, quantity: event.target.value }))} placeholder="50" />
            </div>

            <div className="space-y-2">
              <Label>{t('offer.website_url')}</Label>
              <Input value={formState.websiteUrl} onChange={event => setFormState(prev => ({ ...prev, websiteUrl: event.target.value }))} placeholder="https://example.com/wine" />
            </div>

            <Button type="button" onClick={handleAddWines} disabled={isAdding || !selectedWines?.length}>
              {isAdding ? t('button.adding') : t('button.add_wines')}
            </Button>
          </div>

          {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
        </div>
      </div>
    </div>
  )
}

interface AddedWineItemProps {
  wine: IWines
  onRemove: (id: string) => void
}

export const AddedWineItem = ({ wine, onRemove }: AddedWineItemProps) => {
  const { textColorClass } = useContrastText(`${wine.color?.colorHex}`)

  if (!wine.id) return null

  return (
    <div className="group relative flex flex-col justify-between rounded-lg border border-border/50 bg-muted/40 p-3 pr-8 text-sm transition-all hover:bg-muted/70 animate-in fade-in zoom-in-95 duration-200">
      <div className="space-y-1">
        <p className="font-semibold max-w-80 leading-tight text-foreground">{wine.name}</p>
        <p className="text-xs text-muted-foreground">{wine.producer}</p>
      </div>

      {wine.color?.name && (
        <div className="mt-1.5">
          <span
            className={cn(textColorClass, 'inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium shadow-xs ring-1 ring-border/40 ring-inset')}
            style={{
              backgroundColor: wine.color.colorHex || 'var(--background)',
            }}
          >
            {wine.color.name}
          </span>
        </div>
      )}

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full text-muted-foreground opacity-70 transition-all hover:bg-destructive/10 hover:text-destructive hover:opacity-100"
        onClick={() => {
          if (wine.id) onRemove(wine.id)
        }}
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}
