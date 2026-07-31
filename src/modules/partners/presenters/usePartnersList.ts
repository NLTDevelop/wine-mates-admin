/* global HTMLInputElement */
import { keepPreviousData, useMutation, useQuery, UseQueryResult } from '@tanstack/react-query'
import { ChangeEvent, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDebounce } from '@/hooks/ui/useDebounce'
import { useToast } from '@/hooks/shadcn/use-toast'
import { partnerQueries } from '../entities/partner-queries'
import { usePartnerStore } from '../entities/partner-store'
import { PartnerStatus, PartnersResponse } from '../entities/types'

export const usePartnersList = () => {
  const { filters, setFilters, resetFilters } = usePartnerStore()
  const { toast } = useToast()
  const { t } = useTranslation('partners')
  const [searchValue, setSearchValue] = useState(filters.search || '')
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; partnerId: number | null; name: string }>({ isOpen: false, partnerId: null, name: '' })

  const partnersQuery: UseQueryResult<PartnersResponse | undefined, Error> = useQuery({
    ...partnerQueries.list(filters),
    placeholderData: keepPreviousData,
    staleTime: 2000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  })

  const deletePartnerMutation = useMutation({
    ...partnerQueries.delete(),
    onSuccess: () => {
      toast({ title: t('partner_deleted'), variant: 'default' })
    },
    onError: () => {
      toast({ title: t('error_deleting_partner'), variant: 'destructive' })
    },
  })

  const { debouncedWrapper } = useDebounce((value: string) => {
    setFilters({ search: value, page: 1 })
  }, 500)

  const onChangeSearch = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearchValue(event.target.value)
      debouncedWrapper(event.target.value)
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

  const handleStatusChange = useCallback(
    (status: string) => {
      setFilters({ status: status === 'all' ? null : (status as PartnerStatus), page: 1 })
    },
    [setFilters]
  )

  const openDeleteModal = useCallback((partnerId: number, name: string) => {
    setDeleteModal({ isOpen: true, partnerId, name })
  }, [])

  const closeDeleteModal = useCallback(() => {
    setDeleteModal({ isOpen: false, partnerId: null, name: '' })
  }, [])

  const confirmDeletePartner = useCallback(async () => {
    if (!deleteModal.partnerId) return
    await deletePartnerMutation.mutateAsync(deleteModal.partnerId)
    partnersQuery.refetch()
    closeDeleteModal()
  }, [closeDeleteModal, deleteModal.partnerId, deletePartnerMutation, partnersQuery])

  return {
    partners: partnersQuery.data?.rows,
    totalCount: partnersQuery.data?.count,
    isLoading: partnersQuery.isLoading,
    filters,
    searchValue,
    onChangeSearch,
    handleClearSearch,
    onChangePagination,
    handleStatusChange,
    deletePartner: openDeleteModal,
    deleteModal: {
      ...deleteModal,
      onClose: closeDeleteModal,
      onSubmit: confirmDeletePartner,
    },
  }
}
