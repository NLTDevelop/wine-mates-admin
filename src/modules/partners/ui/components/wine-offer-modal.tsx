import { useTranslation } from 'react-i18next'
import { Image } from 'lucide-react'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Input } from '@/UIKit/shadcn/ui/input'
import { Label } from '@/UIKit/shadcn/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/UIKit/shadcn/ui/select'
import { NLTModal } from '@/UIKit/components/NLTModal'
import { NLTTablePagination } from '@/UIKit/components/NLTTablePagination'
import { cn } from '@/lib/utils'
import { useWineOfferForm } from '../../presenters/useWineOfferForm'
import { InputWithTooltip } from '@/UIKit/app-components/input-with-tooltip'

interface WineOfferModalProps {
  isOpen: boolean
  onClose: () => void
  partnerId: number
  currencyOptions: string[]
  currenciesLoading?: boolean
  onSuccess: (data: { partnerId: number; wineId: number; price: number; currency: string; websiteUrl: string; quantity?: number }) => Promise<void>
  isSubmitting?: boolean
}

export const WineOfferModal = ({ isOpen, onClose, partnerId, currencyOptions, currenciesLoading = false, onSuccess, isSubmitting = false }: WineOfferModalProps) => {
  const { t } = useTranslation('partners')
  const { t: tc } = useTranslation('common')

  const {
    formState,
    setFormState,
    wineSearch,
    setWineSearch,
    wineSearchPage,
    setWineSearchPage,
    selectedWine,
    fieldErrors,
    setFormError,
    wineOptions,
    wineSearchTotalCount,
    isLoading,
    handlePriceChange,
    handleWebsiteUrlChange,
    handleSubmit,
    isSubmitting: internalIsSubmitting,
    resetForm,
    getLocationName,
  } = useWineOfferForm({
    onSuccess,
    partnerId,
    currencyOptions,
    isOpen,
  })

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleFormSubmit = async () => {
    const success = await handleSubmit()
    if (success) {
      handleClose()
    }
  }

  const WineInfoPreview = ({ wine, compact = false, className }: { wine: any; compact?: boolean; className?: string }) => {
    const imageUrl = wine.image?.smallUrl || wine.image?.mediumUrl || wine.image?.originalUrl || ''
    const name = wine.name || 'Без назви'

    return (
      <div className={cn('flex gap-3 text-left', compact ? 'items-center' : 'rounded-md border border-input bg-background p-3', className)}>
        {imageUrl ? (
          <img src={imageUrl} alt={name} className={cn('shrink-0 rounded-md object-cover', compact ? 'h-14 w-14' : 'h-20 w-20')} />
        ) : (
          <div className={cn('flex shrink-0 items-center justify-center rounded-md bg-muted', compact ? 'h-14 w-14' : 'h-20 w-20')}>
            <Image className={cn('text-muted-foreground', compact ? 'h-5 w-5' : 'h-6 w-6')} />
          </div>
        )}
        <div className={cn('min-w-0 flex-1', compact ? 'space-y-1' : 'space-y-2')}>
          <p className={cn('break-words font-semibold leading-tight', compact && 'text-sm')}>{name}</p>
          <div className={cn('flex flex-wrap gap-x-3 gap-y-1 text-muted-foreground', compact ? 'text-xs' : 'text-sm')}>
            <span>{getLocationName(wine.country) || '-'}</span>
            <span>{getLocationName(wine.region) || '-'}</span>
            <span>{wine.producer || '-'}</span>
            <span>{wine.grapeVariety || '-'}</span>
            <span>{wine.vintage || '-'}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <NLTModal title={t('offers.add_wine')} isOpen={isOpen} onClose={handleClose} className="sm:max-w-[1080px]">
      <div className="space-y-4 px-1">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>{t('offers.form.wine')} *</Label>
              <Input
                value={wineSearch}
                onChange={event => {
                  setWineSearch(event.target.value)
                  setWineSearchPage(1)
                }}
                placeholder={t('offers.form.wine_search_placeholder')}
                variant="search"
                showClearButton
                onClear={() => {
                  setWineSearch('')
                  setWineSearchPage(1)
                }}
              />
            </div>

            <div className="space-y-3">
              <div className="h-[460px] max-h-[58vh] space-y-1.5 overflow-y-auto rounded-md border border-input bg-background p-2">
                {isLoading && <p className="py-6 text-center text-sm text-muted-foreground">{tc('loading')}</p>}
                {!isLoading && wineOptions.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">{tc('no_results')}</p>}
                {wineOptions.map(wine => {
                  const isSelected = formState.wineId === String(wine.id)
                  return (
                    <button
                      key={wine.id}
                      type="button"
                      className={cn(
                        'w-full rounded-md border border-transparent p-2 text-left transition-colors hover:bg-muted/50',
                        isSelected ? 'border-sidebar-accent bg-muted/60' : 'bg-background'
                      )}
                      onClick={() => {
                        setFormState(prev => ({ ...prev, wineId: String(wine.id) }))
                        setFormError('')
                      }}
                    >
                      <WineInfoPreview wine={wine} compact />
                    </button>
                  )
                })}
              </div>
              {wineSearchTotalCount > 10 && <NLTTablePagination className="pb-0" limit={10} page={wineSearchPage} totalRows={wineSearchTotalCount} setPage={setWineSearchPage} />}
            </div>
          </div>

          <div className="space-y-4 rounded-md border border-input bg-muted/30 p-3">
            <div className="space-y-2">
              <p className="text-sm font-medium">{t('offers.form.selected_wine')}</p>
              {selectedWine ? (
                <WineInfoPreview wine={selectedWine} />
              ) : (
                <div className={cn('text-sm text-center text-muted-foreground', fieldErrors.wineId && 'text-error')}>{fieldErrors.wineId ? t('offers.wine_required') : t('offers.not_chose_wine')}</div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-2">
                <Label>{t('offers.form.price')} *</Label>
                <InputWithTooltip
                  type="number"
                  min="0"
                  step="0.01"
                  value={formState.price}
                  onChange={handlePriceChange}
                  placeholder="199.99"
                  error={fieldErrors.price ? t(fieldErrors.price) : undefined}
                />
              </div>

              <div className="space-y-2">
                <Label>{t('offers.form.currency')} *</Label>
                <Select value={formState.currency} onValueChange={currency => setFormState(prev => ({ ...prev, currency }))} disabled={currenciesLoading}>
                  <SelectTrigger className="h-11 bg-background">
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
                <Label>{t('offers.form.website_url')} *</Label>
                <InputWithTooltip
                  value={formState.websiteUrl}
                  onChange={handleWebsiteUrlChange}
                  placeholder="https://example.com/wine"
                  error={fieldErrors.websiteUrl ? t(fieldErrors.websiteUrl) : undefined}
                />
              </div>

              <div className="space-y-2">
                <Label>{t('offers.form.quantity')}</Label>
                <Input type="number" min="0" step="1" value={formState.quantity} onChange={event => setFormState(prev => ({ ...prev, quantity: event.target.value }))} placeholder="50" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-end gap-2 sm:flex-row">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting || internalIsSubmitting}>
            {tc('button.cancel')}
          </Button>
          <Button type="button" onClick={handleFormSubmit} disabled={isSubmitting || internalIsSubmitting}>
            {isSubmitting ? tc('button.saving') : tc('button.add')}
          </Button>
        </div>
      </div>
    </NLTModal>
  )
}
