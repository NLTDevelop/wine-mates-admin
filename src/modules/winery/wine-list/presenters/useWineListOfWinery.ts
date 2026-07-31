/* global HTMLInputElement */
import { keepPreviousData, useMutation, useQuery, UseQueryResult } from '@tanstack/react-query'
import { ChangeEvent, useCallback, useState } from 'react'
import { useDebounce } from '@/hooks/ui/useDebounce'
import { useToast } from '@/hooks/shadcn/use-toast'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { CreateWineOfferForWineryParams, DeleteWineFromWineryParams, UpdateWineOfferForWineryParams, WineListOfWineryResponse, WineOfWinery } from '../entities/types'
import { wineryWineListQueries } from '../entities/wine-list-queries'
import { getWineryWineOffer } from '../entities/wine-offer-helpers'
import { useAddWinesStore } from '../entities/wine-list-store'

export const useWineListOfWinery = () => {
  const { filters, setFilters, resetFilters } = useAddWinesStore()
  const { toast } = useToast()
  const { t } = useTranslation('winery')
  const { id } = useParams<{ id: string }>()

  const [searchValue, setSearchValue] = useState<string>('')
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; wineId: string | null; wineName: string; offerId: number | null }>({ isOpen: false, wineId: null, wineName: '', offerId: null })
  const [offerToEdit, setOfferToEdit] = useState<WineOfWinery | null>(null)

  const wineListOfWineryQuery: UseQueryResult<WineListOfWineryResponse | undefined, Error> = useQuery({
    ...wineryWineListQueries.listWine(parseInt(id!), filters),
    placeholderData: keepPreviousData,
    staleTime: 2000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  })
  const deleteWineMutation = useMutation({
    ...wineryWineListQueries.deleteWine(),
    onSuccess: () => {
      toast({ title: t('wine_deleted'), variant: 'default' })
    },
  })

  const updateOfferMutation = useMutation({
    ...wineryWineListQueries.updateOffer(),
    onSuccess: () => {
      toast({ title: t('offer.offer_updated'), variant: 'default' })
      wineListOfWineryQuery.refetch()
      setOfferToEdit(null)
    },
    onError: () => {
      toast({ title: t('offer.error_updating_offer'), variant: 'destructive' })
    },
  })

  const createOfferMutation = useMutation({
    ...wineryWineListQueries.createOffer(),
    onSuccess: () => {
      toast({ title: t('offer.offer_created'), variant: 'default' })
      wineListOfWineryQuery.refetch()
      setOfferToEdit(null)
    },
    onError: () => {
      toast({ title: t('offer.error_creating_offer'), variant: 'destructive' })
    },
  })

  const deleteOfferMutation = useMutation({
    ...wineryWineListQueries.deleteOffer(),
    onSuccess: () => {
      toast({ title: t('wine_deleted'), variant: 'default' })
    },
  })

  const { debouncedWrapper } = useDebounce((searchValue: string) => {
    setFilters({ search: searchValue, page: 1 })
  }, 500)

  const handleSearchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value)
      debouncedWrapper(e.target.value)
    },
    [debouncedWrapper]
  )

  const handleClearSearch = useCallback(() => {
    setSearchValue('')
    resetFilters()
  }, [resetFilters])

  const onChangePagination = useCallback(
    (page: number) => {
      setFilters({ page })
    },
    [setFilters]
  )

  const getOfferId = useCallback((wine: WineOfWinery) => {
    const offerId = getWineryWineOffer(wine)?.id
    if (offerId) return Number(offerId)

    return null
  }, [])

  const resetDeleteModal = useCallback(() => {
    setDeleteModal({
      isOpen: false,
      wineId: null,
      wineName: '',
      offerId: null,
    })
  }, [])

  const closeDeleteModal = useCallback(() => {
    resetDeleteModal()
  }, [resetDeleteModal])

  const deleteWine = useCallback(
    async (wineId: number, offerId?: number | null) => {
      if (!id) return

      if (offerId) {
        await deleteOfferMutation.mutateAsync(offerId)
        wineListOfWineryQuery.refetch()
        closeDeleteModal()
        return
      }

      const reqBody: DeleteWineFromWineryParams = {
        wineryId: id,
        wineIds: [wineId],
      }
      await deleteWineMutation.mutateAsync(reqBody)
      wineListOfWineryQuery.refetch()
      closeDeleteModal()
    },
    [closeDeleteModal, deleteOfferMutation, deleteWineMutation, id, wineListOfWineryQuery]
  )

  const openDeleteModal = useCallback(
    (wineId: string, wineName: string = '', wine?: WineOfWinery) => {
      const offerId = wine ? getOfferId(wine) : null

      setDeleteModal({
        isOpen: true,
        wineId,
        wineName,
        offerId: offerId && !Number.isNaN(offerId) ? offerId : null,
      })
    },
    [getOfferId]
  )

  const openEditModal = useCallback((wine: WineOfWinery) => {
    setOfferToEdit(wine)
  }, [])

  const closeEditModal = useCallback(() => {
    setOfferToEdit(null)
  }, [])

  const updateOffer = useCallback(
    async (params: Omit<UpdateWineOfferForWineryParams, 'id'>) => {
      if (!offerToEdit) return

      const offerId = getOfferId(offerToEdit)

      if (offerId && !Number.isNaN(offerId)) {
        await updateOfferMutation.mutateAsync({
          id: offerId,
          ...params,
        })
        return
      }

      const wineryId = Number(id)
      const wineId = Number(offerToEdit.id)

      if (!wineryId || Number.isNaN(wineryId)) {
        toast({ title: t('offer.winery_id_missing'), variant: 'destructive' })
        return
      }

      if (!wineId || Number.isNaN(wineId)) {
        toast({ title: t('offer.wine_id_missing'), variant: 'destructive' })
        return
      }

      const createPayload: CreateWineOfferForWineryParams = {
        wineryId,
        wineId,
        ...params.data,
      }

      await createOfferMutation.mutateAsync(createPayload)
    },
    [createOfferMutation, getOfferId, id, offerToEdit, t, toast, updateOfferMutation]
  )

  const confirmDeleteWine = useCallback(async () => {
    if (deleteModal.wineId) {
      await deleteWine(Number(deleteModal.wineId), deleteModal.offerId)
    }
  }, [deleteModal.offerId, deleteModal.wineId, deleteWine])

  return {
    wines: wineListOfWineryQuery.data?.rows,
    totalCount: wineListOfWineryQuery.data?.count,
    isLoading: wineListOfWineryQuery.isLoading,
    isFetching: wineListOfWineryQuery.isFetching,
    filters,
    searchValue,

    onChangeSearch: handleSearchChange,
    handleClearSearch,
    onChangePagination,

    deleteWine: openDeleteModal,
    isDeleting: deleteWineMutation.isPending,
    editOffer: openEditModal,
    updateOffer,
    isOfferSubmitting: updateOfferMutation.isPending || createOfferMutation.isPending,

    deleteModal: {
      ...deleteModal,
      onClose: closeDeleteModal,
      onSubmit: confirmDeleteWine,
    },
    editModal: {
      wine: offerToEdit,
      isOpen: !!offerToEdit,
      onClose: closeEditModal,
    },
  }
}
