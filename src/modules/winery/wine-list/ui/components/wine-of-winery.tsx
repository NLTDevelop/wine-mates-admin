/* eslint-disable react/react-in-jsx-scope */
/* global HTMLInputElement, URL */
import { WarningModal } from '@/modals/warningModal'
import { useDataTable } from '@/UIKit/components/NLTDataTable/useDataTable'
import { ChangeEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useWineListColumns } from '../../../details/presenters/useWineListColumns'
import { useWineListOfWinery } from '../../presenters/useWineListOfWinery'
import { ContentLayout } from '@/layout/components/content-layout'
import { NLTDataTable } from '@/UIKit/components/NLTDataTable'
import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'
import { NLTTablePagination } from '@/UIKit/components/NLTTablePagination'
import { NLTModal } from '@/UIKit/components/NLTModal'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Input } from '@/UIKit/shadcn/ui/input'
import { Label } from '@/UIKit/shadcn/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/UIKit/shadcn/ui/select'
import { useCurrencyOptions } from '@/modules/events/presenters/useCurrencyOptions'
import { getWineryWineOffer } from '../../entities/wine-offer-helpers'

const isValidWebsiteUrl = (value: string) => {
  if (!value) return true

  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol)
  } catch {
    return false
  }
}

export const WineOfWinery = () => {
  const { t } = useTranslation('winery')
  const { t: tc } = useTranslation('common')
  const { currencies, isLoading: currenciesLoading } = useCurrencyOptions()

  const { wines, isLoading, totalCount, handleClearSearch, deleteModal, editModal, filters, onChangePagination, deleteWine, editOffer, updateOffer, isOfferSubmitting } = useWineListOfWinery()
  const [formState, setFormState] = useState({ price: '', currency: 'UAH', quantity: '', websiteUrl: '' })
  const [formError, setFormError] = useState('')

  const currencyOptions = currencies.length ? currencies : ['UAH']
  const columns = useWineListColumns({ onDelete: deleteWine, onEdit: editOffer, showCheckbox: false, showDelete: true, showEdit: true, showOfferColumns: true })
  const { table } = useDataTable(wines ?? [], columns)

  useEffect(() => {
    handleClearSearch()
  }, [handleClearSearch])

  useEffect(() => {
    if (!editModal.wine) return

    const offer = getWineryWineOffer(editModal.wine)

    setFormState({
      price: offer?.price === null || offer?.price === undefined ? '' : String(offer.price),
      currency: offer?.currency || 'UAH',
      quantity: offer?.quantity === null || offer?.quantity === undefined ? '' : String(offer.quantity),
      websiteUrl: offer?.websiteUrl || '',
    })
    setFormError('')
  }, [editModal.wine])

  const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({ ...prev, price: event.target.value }))
  }

  const handleSubmitOffer = async () => {
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
    await updateOffer({
      data: {
        price,
        currency: formState.currency || 'UAH',
        ...(quantity !== undefined ? { quantity } : {}),
        ...(websiteUrl ? { websiteUrl } : {}),
      },
    })
  }

  return (
    <ContentLayout>
      <div className={cn('pb-2', !isLoading ? 'fade-in' : '')}>
        <NLTDataTable table={table} rowClassname="text-center " />
      </div>

      {totalCount && totalCount > DEFAULT_PAGINATION_LIMIT ? <NLTTablePagination limit={filters.limit} page={filters.page} totalRows={totalCount || 1} setPage={onChangePagination} /> : null}

      <NLTModal title={t('offer.edit_offer')} isOpen={editModal.isOpen} onClose={editModal.onClose} className="sm:max-w-[720px]">
        <div className="space-y-4 px-1">
          <div className="rounded-md border border-input bg-muted/30 p-4">
            <p className="font-semibold leading-tight">{editModal.wine?.name || editModal.wine?.producer || t('offer.unknown_wine')}</p>
            <p className="mt-1 text-sm text-muted-foreground">{[editModal.wine?.producer, editModal.wine?.grapeVariety, editModal.wine?.vintage].filter(Boolean).join(', ') || '-'}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_140px]">
            <div className="space-y-2">
              <Label>{t('offer.price')} *</Label>
              <Input type="number" min="0" step="0.01" value={formState.price} onChange={handlePriceChange} placeholder="199.99" />
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
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_150px]">
            <div className="space-y-2">
              <Label>{t('offer.website_url')}</Label>
              <Input value={formState.websiteUrl} onChange={event => setFormState(prev => ({ ...prev, websiteUrl: event.target.value }))} placeholder="https://example.com/wine" />
            </div>

            <div className="space-y-2">
              <Label>{t('offer.quantity')}</Label>
              <Input type="number" min="0" step="1" value={formState.quantity} onChange={event => setFormState(prev => ({ ...prev, quantity: event.target.value }))} placeholder="50" />
            </div>
          </div>

          {formError ? <p className="text-sm text-destructive">{formError}</p> : null}

          <div className="flex flex-col justify-end gap-2 sm:flex-row">
            <Button type="button" variant="outline" onClick={editModal.onClose} disabled={isOfferSubmitting}>
              {tc('button.cancel')}
            </Button>
            <Button type="button" onClick={handleSubmitOffer} disabled={isOfferSubmitting}>
              {isOfferSubmitting ? tc('button.saving') : tc('button.save')}
            </Button>
          </div>
        </div>
      </NLTModal>

      <WarningModal
        title={t('modal.wine_delete')}
        actionTitle={t('button.delete')}
        description={t('modal.delete_description', { slug: `${deleteModal.wineName}` })}
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        onSubmit={deleteModal.onSubmit}
      />
    </ContentLayout>
  )
}
