import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useToast } from '@/hooks/shadcn/use-toast'
import { partnerWineOfferQueries } from '../entities/partner-wine-offer-queries'
import { PartnerWineOffer } from '../entities/partner-wine-offer-types'

export const PARTNER_WINE_OFFERS_LIMIT = 10

export const usePartnerWineOffers = (partnerId: number) => {
  const { t } = useTranslation('partners')
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [offerToDelete, setOfferToDelete] = useState<PartnerWineOffer | null>(null)

  const filters = useMemo(
    () => ({
      partnerId,
      page,
      limit: PARTNER_WINE_OFFERS_LIMIT,
    }),
    [page, partnerId]
  )

  const offersQuery = useQuery({
    ...partnerWineOfferQueries.list(filters),
    placeholderData: keepPreviousData,
    enabled: !!partnerId,
    staleTime: 2000,
  })

  const invalidateOffers = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['partners', 'wine-offers'] })
  }, [queryClient])

  const createMutation = useMutation({
    ...partnerWineOfferQueries.create(),
    onSuccess: () => {
      invalidateOffers()
      toast({ title: t('offers.offer_created'), variant: 'default' })
    },
    onError: () => {
      toast({ title: t('offers.error_creating_offer'), variant: 'destructive' })
    },
  })

  const updateMutation = useMutation({
    ...partnerWineOfferQueries.update(),
    onSuccess: () => {
      invalidateOffers()
      toast({ title: t('offers.offer_updated'), variant: 'default' })
    },
    onError: () => {
      toast({ title: t('offers.error_updating_offer'), variant: 'destructive' })
    },
  })

  const deleteMutation = useMutation({
    ...partnerWineOfferQueries.delete(),
    onSuccess: () => {
      invalidateOffers()
      toast({ title: t('offers.offer_deleted'), variant: 'default' })
    },
    onError: () => {
      toast({ title: t('offers.error_deleting_offer'), variant: 'destructive' })
    },
  })

  const confirmDeleteOffer = useCallback(async () => {
    if (!offerToDelete) return
    await deleteMutation.mutateAsync(offerToDelete.id)
    setOfferToDelete(null)
  }, [deleteMutation, offerToDelete])

  const offersResponse = offersQuery.data
  const offers = Array.isArray(offersResponse) ? offersResponse : offersResponse?.data || offersResponse?.rows || []
  const totalCount = Array.isArray(offersResponse) ? offersResponse.length : offersResponse?.meta?.total || offersResponse?.count || offers.length

  return {
    offers,
    totalCount,
    page,
    limit: PARTNER_WINE_OFFERS_LIMIT,
    setPage,
    isLoading: offersQuery.isLoading,
    isFetching: offersQuery.isFetching,
    createOffer: createMutation.mutateAsync,
    updateOffer: updateMutation.mutateAsync,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    deleteModal: {
      offer: offerToDelete,
      isOpen: !!offerToDelete,
      onOpen: setOfferToDelete,
      onClose: () => setOfferToDelete(null),
      onSubmit: confirmDeleteOffer,
    },
  }
}
