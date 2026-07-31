import { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/UIKit/shadcn/ui/input'
import { Label } from '@/UIKit/shadcn/ui/label'
import { NLTDataTable } from '@/UIKit/components/NLTDataTable'
import { useDataTable } from '@/UIKit/components/NLTDataTable/useDataTable'
import { NLTModal } from '@/UIKit/components/NLTModal'
import { NLTTablePagination } from '@/UIKit/components/NLTTablePagination'
import { WarningModal } from '@/modals/warningModal'
import { useWineListColumns } from '@/modules/winery/details/presenters/useWineListColumns'
import { WineOfWinery } from '@/modules/winery/wine-list/entities/types'
import { PartnerWineOffer } from '../../entities/partner-wine-offer-types'
import { cn } from '@/lib/utils'
import { Image } from 'lucide-react'
import { Button } from '@/UIKit/shadcn/ui/button'
import { ContentLayout } from '@/layout/components/content-layout'

interface PartnerWineOffersProps {
  offers: PartnerWineOffer[]
  totalCount: number
  page: number
  limit: number
  setPage: (page: number) => void
  updateOffer: (data: { id: number; data: { price: number; websiteUrl: string; quantity?: number } }) => Promise<void>
  isSubmitting: boolean
  deleteModal: {
    isOpen: boolean
    offer: PartnerWineOffer | null
    onOpen: (offer: PartnerWineOffer) => void
    onClose: () => void
    onSubmit: () => void
  }
}

interface OfferFormState {
  wineId: string
  price: string
  currency: string
  websiteUrl: string
  quantity: string
}

interface OfferModalState {
  isOpen: boolean
  mode: 'create' | 'edit'
  offer: PartnerWineOffer | null
}

const getLocationName = (location?: { name?: string } | string | null) => {
  if (!location) return ''
  return typeof location === 'string' ? location : location.name || ''
}

const getWineName = (offer?: PartnerWineOffer | null) => {
  if (!offer) return ''
  const wine = offer.wine
  if (!wine) return 'Без назви'
  return wine.name || wine.producer || [wine.grapeVariety, wine.vintage].filter(Boolean).join(', ') || 'Без назви'
}

const normalizePrice = (price: string | number) => {
  const numericPrice = Number(price)
  if (Number.isNaN(numericPrice)) return String(price)
  return numericPrice.toFixed(2)
}

const isValidWebsiteUrl = (value: string) => {
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol)
  } catch {
    return false
  }
}

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

export const PartnerWineOffers = ({ offers, totalCount, page, limit, setPage, updateOffer, isSubmitting, deleteModal }: PartnerWineOffersProps) => {
  const { t } = useTranslation('partners')
  const { t: tc } = useTranslation('common')

  const [editModal, setEditModal] = useState<OfferModalState>({
    isOpen: false,
    mode: 'edit',
    offer: null,
  })
  const [editFormState, setEditFormState] = useState<OfferFormState>({
    wineId: '',
    price: '',
    currency: 'UAH',
    websiteUrl: '',
    quantity: '',
  })
  const [editFormError, setEditFormError] = useState('')

  const openEditModal = (offer: PartnerWineOffer) => {
    setEditModal({ isOpen: true, mode: 'edit', offer })
    setEditFormState({
      wineId: String(offer.wineId),
      price: String(offer.price || ''),
      currency: offer.currency || 'UAH',
      websiteUrl: offer.websiteUrl || '',
      quantity: offer.quantity === null || offer.quantity === undefined ? '' : String(offer.quantity),
    })
    setEditFormError('')
  }

  const closeEditModal = () => {
    setEditModal({ isOpen: false, mode: 'edit', offer: null })
    setEditFormState({
      wineId: '',
      price: '',
      currency: 'UAH',
      websiteUrl: '',
      quantity: '',
    })
    setEditFormError('')
  }

  const handleEditPriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditFormState(prev => ({ ...prev, price: event.target.value }))
  }

  const handleEditSubmit = async () => {
    const price = Number(editFormState.price)
    const websiteUrl = editFormState.websiteUrl.trim()
    const quantity = editFormState.quantity.trim() ? Number(editFormState.quantity) : undefined

    if (Number.isNaN(price) || price <= 0) {
      setEditFormError(t('offers.price_required'))
      return
    }

    if (!websiteUrl) {
      setEditFormError(t('offers.link_required'))
      return
    }

    if (!isValidWebsiteUrl(websiteUrl)) {
      setEditFormError(t('offers.link_invalid'))
      return
    }

    if (quantity !== undefined && (!Number.isInteger(quantity) || quantity < 0)) {
      setEditFormError(t('offers.quantity_invalid'))
      return
    }

    const offerPayload = {
      price,
      websiteUrl,
      ...(quantity !== undefined ? { quantity } : {}),
    }

    if (editModal.offer) {
      await updateOffer({ id: editModal.offer.id, data: offerPayload })
      closeEditModal()
    }
  }

  const getOfferByRow = useCallback((wine: WineOfWinery) => offers.find(offer => offer.id === wine.offerId) || offers.find(offer => offer.wineId === Number(wine.id)), [offers])

  const columns = useWineListColumns({
    showCheckbox: false,
    showDelete: true,
    showEdit: true,
    showOfferColumns: true,
    onEdit: wine => {
      const offer = getOfferByRow(wine)
      if (offer) openEditModal(offer)
    },
    onDelete: (_wineId, _wineName, wine) => {
      const offer = getOfferByRow(wine)
      if (offer) deleteModal.onOpen(offer)
    },
  })

  const offerRows = useMemo<WineOfWinery[]>(
    () =>
      offers.map(offer => ({
        id: offer.wineId,
        offerId: offer.id,
        name: offer.wine?.name || '',
        producer: offer.wine?.producer,
        vintage: offer.wine?.vintage,
        grapeVariety: offer.wine?.grapeVariety,
        image: offer.wine?.image || offer.wine?.defaultImage || undefined,
        price: offer.price,
        currency: offer.currency,
        quantity: offer.quantity,
        websiteUrl: offer.websiteUrl,
      })),
    [offers]
  )

  const { table } = useDataTable(offerRows, columns)

  return (
    <ContentLayout>
      <div className={cn('pb-2 fade-in')}>
        <NLTDataTable table={table} rowClassname="text-center" ToolBar={null} />

        {totalCount > limit && <NLTTablePagination limit={limit} page={page} totalRows={totalCount} setPage={setPage} />}
      </div>

      <NLTModal title={t('offers.edit_price')} isOpen={editModal.isOpen} onClose={closeEditModal} className="sm:max-w-[720px]">
        <div className="space-y-4 px-1">
          <div className="space-y-4">
            <div className="space-y-3 rounded-md border border-input bg-muted/30 p-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium">{t('offers.form.wine')}</p>
                {editModal.offer && (
                  <p className="text-sm text-muted-foreground">
                    {t('offers.form.current_price')}: {normalizePrice(editModal.offer.price)} {editModal.offer.currency}
                  </p>
                )}
              </div>
              <WineInfoPreview
                imageUrl={getOfferWineImageUrl(editModal.offer)}
                name={getWineName(editModal.offer)}
                producer={editModal.offer?.wine?.producer}
                grapeVariety={editModal.offer?.wine?.grapeVariety}
                vintage={editModal.offer?.wine?.vintage}
                country={getLocationName(editModal.offer?.wine?.country)}
                region={getLocationName(editModal.offer?.wine?.region)}
                className="border-0 bg-background"
              />
            </div>

            <div className="space-y-4 rounded-md border border-input bg-background p-4">
              <div className="space-y-2">
                <Label>{t('offers.form.new_price')} *</Label>
                <div className="relative">
                  <Input type="number" min="0" step="0.01" value={editFormState.price} onChange={handleEditPriceChange} placeholder="199.99" className="pr-20" />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-muted px-2 py-1 text-sm font-medium text-muted-foreground">
                    {editFormState.currency || editModal.offer?.currency || 'UAH'}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{t('offers.form.price_hint')}</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_150px]">
                <div className="space-y-2">
                  <Label>{t('offers.form.website_url')} *</Label>
                  <Input value={editFormState.websiteUrl} onChange={event => setEditFormState(prev => ({ ...prev, websiteUrl: event.target.value }))} placeholder="https://example.com/wine" />
                </div>

                <div className="space-y-2">
                  <Label>{t('offers.form.quantity')}</Label>
                  <Input type="number" min="0" step="1" value={editFormState.quantity} onChange={event => setEditFormState(prev => ({ ...prev, quantity: event.target.value }))} placeholder="50" />
                </div>
              </div>
            </div>
          </div>

          {editFormError && <p className="text-sm text-destructive">{editFormError}</p>}

          <div className="flex flex-col justify-end gap-2 sm:flex-row">
            <Button type="button" variant="outline" onClick={closeEditModal} disabled={isSubmitting}>
              {tc('button.cancel')}
            </Button>
            <Button type="button" onClick={handleEditSubmit} disabled={isSubmitting}>
              {isSubmitting ? tc('button.saving') : tc('button.save')}
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
    </ContentLayout>
  )
}
