import { keepPreviousData, useMutation, useQuery, UseQueryResult } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { useDebounce } from '@/hooks/ui/useDebounce'
import { useToast } from '@/hooks/shadcn/use-toast'
import { useTranslation } from 'react-i18next'
import { useEventStore } from '../entities/events-store'
import { EventResponse } from '../entities/types'
import { eventQueries } from '../entities/event-queries'

export const useEventList = () => {
  const { filters, setFilters, resetFilters } = useEventStore()
  const { toast } = useToast()
  const { t } = useTranslation('events')

  const [searchValue, setSearchValue] = useState<string>('')
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; eventId: number | null; theme: string }>({ isOpen: false, eventId: null, theme: '' })

  const eventQuery: UseQueryResult<EventResponse | undefined, Error> = useQuery({
    ...eventQueries.list(filters),
    placeholderData: keepPreviousData,
    staleTime: 2000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  const deleteEventMutation = useMutation({
    ...eventQueries.delete(),
    onSuccess: () => {
      toast({
        title: t('event_deleted'),
        variant: 'default',
      })
    },
  })

  const { debouncedWrapper } = useDebounce((searchValue: string) => {
    setFilters({ search: searchValue, page: 1 })
  }, 500)

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value)
      debouncedWrapper(e.target.value)
    },
    [debouncedWrapper]
  )

  const handleClearSearch = useCallback(() => {
    setSearchValue('')
    resetFilters()
  }, [resetFilters])

  const handleColumnFilter = useCallback(
    (column: string, value: any) => {
      setFilters({
        [column]: value,
        page: 1,
      })
    },
    [setFilters]
  )

  const clearColumnFilters = useCallback(() => {
    const filtersToClear = ['minPrice', 'maxPrice', 'dateFrom', 'dateTo', 'isActive', 'countryId']

    filtersToClear.forEach(filter => {
      handleColumnFilter(filter, null)
    })

    setFilters({ page: 1 })
  }, [handleColumnFilter, setFilters])

  const onChangePagination = useCallback(
    (page: number) => {
      setFilters({ page })
    },
    [setFilters]
  )

  const deleteEvent = useCallback(
    async (eventId: number) => {
      await deleteEventMutation.mutateAsync(eventId)
      eventQuery.refetch()
      closeDeleteModal()
    },
    [deleteEventMutation, eventQuery]
  )

  const openDeleteModal = useCallback((eventId: number, theme: string = '') => {
    setDeleteModal({
      isOpen: true,
      eventId,
      theme,
    })
  }, [])

  const closeDeleteModal = useCallback(() => {
    setDeleteModal({
      isOpen: false,
      eventId: null,
      theme: '',
    })
  }, [])

  const confirmDeleteEvent = useCallback(async () => {
    if (deleteModal.eventId) {
      await deleteEvent(deleteModal.eventId)
    }
  }, [deleteModal.eventId, deleteEvent])

  const handleDateFilter = useCallback(
    (dateFrom: string | null, dateTo: string | null) => {
      setFilters({
        dateFrom,
        dateTo,
        page: 1,
      })
    },
    [setFilters]
  )

  const handlePriceFilter = useCallback(
    (value: { minPrice: number | null; maxPrice: number | null }) => {
      setFilters({
        minPrice: value.minPrice,
        maxPrice: value.maxPrice,
        page: 1,
      })
    },
    [setFilters]
  )

  return {
    events: eventQuery.data?.rows,
    totalCount: eventQuery.data?.count,
    isLoading: eventQuery.isLoading,
    isFetching: eventQuery.isFetching,
    filters,
    searchValue,

    handleColumnFilter,
    clearColumnFilters,
    handleDateFilter,
    handlePriceFilter,

    columnFilters: {
      maxPrice: filters.maxPrice,
      minPrice: filters.minPrice,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      isActive: filters.isActive,
      country: filters.countryId,
    },

    onChangeSearch: handleSearchChange,
    handleClearSearch,
    onChangePagination,

    deleteEvent: openDeleteModal,
    isDeleting: deleteEventMutation.isPending,

    deleteModal: {
      ...deleteModal,
      onClose: closeDeleteModal,
      onSubmit: confirmDeleteEvent,
    },
  }
}
