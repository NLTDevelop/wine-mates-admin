/* eslint-disable react/react-in-jsx-scope */
/* global HTMLInputElement */
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import { ChangeEvent, useMemo, useState } from 'react'
import { Edit, Image, Plus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { Input } from '@/UIKit/shadcn/ui/input'
import { Label } from '@/UIKit/shadcn/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/UIKit/shadcn/ui/select'
import { NLTDataTable } from '@/UIKit/components/NLTDataTable'
import { useDataTable } from '@/UIKit/components/NLTDataTable/useDataTable'
import { NLTModal } from '@/UIKit/components/NLTModal'
import { NLTTablePagination } from '@/UIKit/components/NLTTablePagination'
import { WarningModal } from '@/modals/warningModal'
import { useCurrencyOptions } from '@/modules/events/presenters/useCurrencyOptions'
import { eventsService } from '@/modules/events/entities/events-service'
import { WineSearchItem } from '@/modules/events/entities/types/wine-search.dto'
import { cn } from '@/lib/utils'
import { usePartnerWineOffers } from '../../presenters/usePartnerWineOffers'
import { PartnerWineOffer } from '../../entities/partner-wine-offer-types'

type ModalMode = 'create' | 'edit'

interface OfferFormState {
  wineId: string
  price: string
  currency: string
}

interface OfferModalState {
  isOpen: boolean
  mode: ModalMode
  offer: PartnerWineOffer | null
}

interface PartnerWineOffersProps {
  partnerId: number
}

const columnHelper = createColumnHelper<PartnerWineOffer>()

const getWineImageUrl = (offer: PartnerWineOffer) => offer.wine?.image?.smallUrl || offer.wine?.defaultImage?.smallUrl || ''

const getLocationName = (location?: { name?: string } | string | null) => {
  if (!location) return ''
  return typeof location === 'string' ? location : location.name || ''
}

const getWineName = (offer?: PartnerWineOffer | null) => {
  if (!offer) return ''
  const wine = offer.wine
  if (!wine) return 'Без назви'

  return [wine.name, wine.grapeVariety, wine.vintage].filter(Boolean).join(', ') || 'Без назви'
}

const normalizePrice = (price: string | number) => {
  const numericPrice = Number(price)
  if (Number.isNaN(numericPrice)) return String(price)
  return numericPrice.toFixed(2)
}

const getSearchWineImageUrl = (wine: WineSearchItem) => wine.image?.smallUrl || wine.image?.mediumUrl || wine.image?.originalUrl || ''

const getOfferWineImageUrl = (offer?: PartnerWineOffer | null) =>
  offer?.wine?.image?.smallUrl || offer?.wine?.image?.mediumUrl || offer?.wine?.image?.originalUrl || offer?.wine?.defaultImage?.smallUrl || ''

const WineInfoPreview = ({
  imageUrl,
  name,
  producer,
  grapeVariety,
  vintage,
  country,
  region,
  compact = false,
  className,
}: {
  imageUrl: string
  name: string
  producer?: string
  grapeVariety?: string
  vintage?: number
  country?: string
  region?: string
  compact?: boolean
  className?: string
}) => (
  <div className={cn('flex gap-3 text-left', compact ? 'items-center' : 'rounded-md border border-input bg-background p-3', className)}>
    {imageUrl ? (
      <img src={imageUrl} alt={name} className={cn('shrink-0 rounded-md object-cover', compact ? 'h-14 w-14' : 'h-20 w-20')} />
    ) : (
      <div className={cn('flex shrink-0 items-center justify-center rounded-md bg-muted', compact ? 'h-14 w-14' : 'h-20 w-20')}>
        <Image className={cn('text-muted-foreground', compact ? 'h-5 w-5' : 'h-6 w-6')} />
      </div>
    )}
    <div className={cn('min-w-0 flex-1', compact ? 'space-y-1' : 'space-y-2')}>
      <div>
        <p className={cn('break-words font-semibold leading-tight', compact && 'text-sm')}>{name || 'Без назви'}</p>
      </div>
      <div className={cn('flex flex-wrap gap-x-3 gap-y-1 text-muted-foreground', compact ? 'text-xs' : 'text-sm')}>
        <span>{country || '-'}</span>
        <span>{region || '-'}</span>
        <span>{producer || '-'}</span>
        <span>{grapeVariety || '-'}</span>
        <span>{vintage || '-'}</span>
      </div>
    </div>
  </div>
)

export const PartnerWineOffers = ({ partnerId }: PartnerWineOffersProps) => {
  const { t } = useTranslation('partners')
  const { t: tc } = useTranslation('common')
  const { offers, totalCount, page, limit, setPage, createOffer, updateOffer, isSubmitting, deleteModal } = usePartnerWineOffers(partnerId)
  const { currencies, isLoading: currenciesLoading } = useCurrencyOptions()

  const [modal, setModal] = useState<OfferModalState>({ isOpen: false, mode: 'create', offer: null })
  const [formState, setFormState] = useState<OfferFormState>({ wineId: '', price: '', currency: 'UAH' })
  const [formError, setFormError] = useState('')
  const [wineSearch, setWineSearch] = useState('')

  const currencyOptions = currencies.length ? currencies : ['UAH']
  const isCreateModal = modal.isOpen && modal.mode === 'create'

  const wineSearchQuery = useQuery({
    queryKey: ['partners', 'wine-search', wineSearch],
    queryFn: () => eventsService.search({ query: wineSearch, limit: 20, offset: 0 }),
    enabled: isCreateModal,
    staleTime: 2000,
  })

  const wineOptions = wineSearchQuery.data?.rows || []
  const selectedWine = wineOptions.find(wine => String(wine.id) === formState.wineId)

  const closeModal = () => {
    setModal({ isOpen: false, mode: 'create', offer: null })
    setFormState({ wineId: '', price: '', currency: 'UAH' })
    setFormError('')
    setWineSearch('')
  }

  const openCreateModal = () => {
    setModal({ isOpen: true, mode: 'create', offer: null })
    setFormState({ wineId: '', price: '', currency: currencyOptions.includes('UAH') ? 'UAH' : currencyOptions[0] || 'UAH' })
    setFormError('')
    setWineSearch('')
  }

  const openEditModal = (offer: PartnerWineOffer) => {
    setModal({ isOpen: true, mode: 'edit', offer })
    setFormState({
      wineId: String(offer.wineId),
      price: String(offer.price || ''),
      currency: offer.currency || 'UAH',
    })
    setFormError('')
  }

  const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({ ...prev, price: event.target.value }))
  }

  const handleSubmit = async () => {
    const price = Number(formState.price)

    if (Number.isNaN(price) || price <= 0) {
      setFormError(t('offers.price_required'))
      return
    }

    if (modal.mode === 'create') {
      const wineId = Number(formState.wineId)

      if (!wineId) {
        setFormError(t('offers.wine_required'))
        return
      }

      await createOffer({
        partnerId,
        wineId,
        price,
        currency: formState.currency || 'UAH',
      })
      closeModal()
      return
    }

    if (modal.offer) {
      await updateOffer({ id: modal.offer.id, data: { price } })
      closeModal()
    }
  }

  const columns = useMemo(
    () =>
      [
        columnHelper.display({
          id: 'wine',
          header: () => t('offers.table.wine'),
          cell: ({ row }) => {
            const imageUrl = getWineImageUrl(row.original)
            return (
              <div className="flex items-center gap-3 text-start">
                {imageUrl ? (
                  <img src={imageUrl} alt={getWineName(row.original)} className="h-11 w-11 rounded-md object-cover" />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-md bg-muted">
                    <Image className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="break-words font-medium">{getWineName(row.original)}</p>
                  <p className="text-xs text-muted-foreground">{[getLocationName(row.original.wine?.country), getLocationName(row.original.wine?.region)].filter(Boolean).join(', ') || '-'}</p>
                </div>
              </div>
            )
          },
          minSize: 360,
          size: 360,
          meta: { cellClassName: 'text-start w-[360px]' },
        }),
        columnHelper.accessor('price', {
          header: () => t('offers.table.price'),
          cell: ({ row }) => `${normalizePrice(row.original.price)} ${row.original.currency}`,
          minSize: 140,
          size: 140,
          meta: { cellClassName: 'text-start w-[140px]' },
        }),
        columnHelper.accessor('updatedAt', {
          header: () => t('offers.table.updated_at'),
          cell: info => (info.getValue() ? new Date(info.getValue() as string).toLocaleDateString('uk-UA') : '-'),
          minSize: 140,
          size: 140,
          meta: { cellClassName: 'text-start w-[140px]' },
        }),
        columnHelper.display({
          id: 'actions',
          header: () => <p className="text-center">{t('offers.table.actions')}</p>,
          cell: ({ row }) => (
            <div className="flex items-center justify-center gap-2">
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEditModal(row.original)}>
                <Edit className="h-4 w-4 text-green-600" />
              </Button>
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => deleteModal.onOpen(row.original)}>
                <Trash2 className="h-4 w-4 text-red-700" />
              </Button>
            </div>
          ),
          minSize: 100,
          size: 100,
          meta: { cellClassName: 'text-center' },
        }),
      ] as ColumnDef<PartnerWineOffer>[],
    [deleteModal, t]
  )

  const { table } = useDataTable(offers, columns)

  return (
    <Card>
      <CardContent className="space-y-4 sm:px-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold">{t('offers.title')}</h3>
            <p className="text-sm text-muted-foreground">{t('offers.description')}</p>
          </div>
          <Button type="button" className="gap-2" onClick={openCreateModal}>
            <Plus className="h-4 w-4" />
            {t('offers.add_wine')}
          </Button>
        </div>

        <NLTDataTable table={table} rowClassname="text-center" ToolBar={null} />

        {totalCount > limit ? <NLTTablePagination limit={limit} page={page} totalRows={totalCount} setPage={setPage} /> : null}
      </CardContent>

      <NLTModal
        title={modal.mode === 'create' ? t('offers.add_wine') : t('offers.edit_price')}
        isOpen={modal.isOpen}
        onClose={closeModal}
        className={modal.mode === 'create' ? 'sm:max-w-[860px]' : 'sm:max-w-[620px]'}
      >
        <div className="space-y-4 px-1">
          {modal.mode === 'create' ? (
            <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>{t('offers.form.wine')} *</Label>
                  <Input
                    value={wineSearch}
                    onChange={event => setWineSearch(event.target.value)}
                    placeholder={t('offers.form.wine_search_placeholder')}
                    variant="search"
                    showClearButton
                    onClear={() => setWineSearch('')}
                  />
                </div>
                <div className="max-h-96 space-y-1.5 overflow-y-auto rounded-md border border-input bg-background p-2">
                  {wineSearchQuery.isLoading ? <p className="py-6 text-center text-sm text-muted-foreground">{tc('loading')}</p> : null}
                  {!wineSearchQuery.isLoading && wineOptions.length === 0 ? <p className="py-6 text-center text-sm text-muted-foreground">{tc('no_results')}</p> : null}
                  {wineOptions.map(wine => {
                    const imageUrl = getSearchWineImageUrl(wine)
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
                        <WineInfoPreview
                          imageUrl={imageUrl}
                          name={wine.name}
                          producer={wine.producer}
                          grapeVariety={wine.grapeVariety}
                          vintage={wine.vintage}
                          country={getLocationName(wine.country)}
                          region={getLocationName(wine.region)}
                          compact
                        />
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-4 rounded-md border border-input bg-muted/30 p-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium">{t('offers.form.selected_wine')}</p>
                  {selectedWine ? (
                    <WineInfoPreview
                      imageUrl={getSearchWineImageUrl(selectedWine)}
                      name={selectedWine.name}
                      producer={selectedWine.producer}
                      grapeVariety={selectedWine.grapeVariety}
                      vintage={selectedWine.vintage}
                      country={getLocationName(selectedWine.country)}
                      region={getLocationName(selectedWine.region)}
                      className="bg-background"
                    />
                  ) : (
                    <div className="rounded-md border border-input bg-background p-4 text-sm text-muted-foreground">{t('offers.wine_required')}</div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-2">
                    <Label>{t('offers.form.price')} *</Label>
                    <Input type="number" min="0" step="0.01" value={formState.price} onChange={handlePriceChange} placeholder="199.99" />
                  </div>

                  <div className="space-y-2">
                    <Label>{t('offers.form.currency')} *</Label>
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
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3 rounded-md border border-input bg-muted/30 p-4">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-medium">{t('offers.form.wine')}</p>
                  {modal.offer ? (
                    <p className="text-sm text-muted-foreground">
                      {t('offers.form.current_price')}: {normalizePrice(modal.offer.price)} {modal.offer.currency}
                    </p>
                  ) : null}
                </div>
                <WineInfoPreview
                  imageUrl={getOfferWineImageUrl(modal.offer)}
                  name={getWineName(modal.offer)}
                  producer={modal.offer?.wine?.producer}
                  grapeVariety={modal.offer?.wine?.grapeVariety}
                  vintage={modal.offer?.wine?.vintage}
                  country={getLocationName(modal.offer?.wine?.country)}
                  region={getLocationName(modal.offer?.wine?.region)}
                  className="border-0 bg-background"
                />
              </div>

              <div className="rounded-md border border-input bg-background p-4">
                <div className="space-y-2">
                  <Label>{t('offers.form.new_price')} *</Label>
                  <div className="relative">
                    <Input type="number" min="0" step="0.01" value={formState.price} onChange={handlePriceChange} placeholder="199.99" className="pr-20" />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-muted px-2 py-1 text-sm font-medium text-muted-foreground">
                      {formState.currency || modal.offer?.currency || 'UAH'}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{t('offers.form.price_hint')}</p>
                </div>
              </div>
            </div>
          )}

          {formError ? <p className="text-sm text-destructive">{formError}</p> : null}

          <div className="flex flex-col justify-end gap-2 sm:flex-row">
            <Button type="button" variant="outline" onClick={closeModal} disabled={isSubmitting}>
              {tc('button.cancel')}
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? tc('button.saving') : modal.mode === 'create' ? tc('button.add') : tc('button.save')}
            </Button>
          </div>
        </div>
      </NLTModal>

      <WarningModal
        title={t('offers.delete_offer')}
        actionTitle={tc('button.delete')}
        description={t('offers.delete_description', { slug: getWineName(deleteModal.offer) })}
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        onSubmit={deleteModal.onSubmit}
      />
    </Card>
  )
}
