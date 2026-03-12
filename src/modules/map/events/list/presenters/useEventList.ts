import { keepPreviousData, useMutation, useQuery, UseQueryResult } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { useDebounce } from '@/hooks/ui/useDebounce'
import { useToast } from '@/hooks/shadcn/use-toast'
import { useTranslation } from 'react-i18next'

import { EVENT_SORT_FIELDS } from '@/constatnts/wine-filters'
import { EventResponse, IUpdateEvent, UpdateEventListParams } from '../entities/types'
import { EventFormData } from '../../detail/presenters/event-form-schema'
import { useEventStore } from '../entities/event-list-store'
import { eventQueries } from '../entities/event-list-queries'
import { mockList } from '../entities/mockList'
import { MapEvent } from '../../entities/types'

export const useEventList = () => {
  const { filters, setFilters, resetFilters } = useEventStore()
  const { toast } = useToast()
  const { t } = useTranslation('wines')

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)
  const [searchValue, setSearchValue] = useState<string>('')
  const [editingEvent, setEditingEvent] = useState<MapEvent | null>(null)
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; eventId: number | null; theme: string }>({ isOpen: false, eventId: null, theme: '' })
  const [event, setEvent] = useState<{ theme: string; isCanceled: boolean }>({ theme: '', isCanceled: false })

  const eventQuery: UseQueryResult<EventResponse | undefined, Error> = useQuery({
    ...eventQueries.list(filters),
    placeholderData: keepPreviousData,
    staleTime: 2000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
  const updateEventMutation = useMutation(eventQueries.update())
  const deleteEventMutation = useMutation({
    ...eventQueries.delete(),
    onSuccess: () => {
      toast({
        title: t('event_deleted'),
        variant: 'default',
      })
    },
  })
  const cancelEventMutation = useMutation(eventQueries.cancelEvent())

  const { debouncedWrapper } = useDebounce((searchValue: string) => {
    setFilters({ search: searchValue, page: 1 })
  }, 500)

  const findEventById = useCallback(
    (eventId: number) => {
      return eventQuery.data?.rows.find((event: MapEvent) => event?.id === eventId)
    },
    [eventQuery.data?.rows]
  )

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

  const handleSort = useCallback(
    (column?: string) => {
      if (!column) {
        setFilters({
          sortBy: undefined,
          page: 1,
        })
        return
      }
      const baseField = EVENT_SORT_FIELDS[column] || column
      const currentSortBy = filters.sortBy || ''

      const isCurrentColumn = currentSortBy === `${baseField}_asc` || currentSortBy === `${baseField}_desc`

      if (isCurrentColumn) {
        const newOrder = currentSortBy.endsWith('_asc') ? 'desc' : 'asc'
        setFilters({
          sortBy: `${baseField}_${newOrder}`,
          page: 1,
        })
      } else {
        setFilters({
          sortBy: `${baseField}_asc`,
          page: 1,
        })
      }
    },
    [setFilters, filters.sortBy]
  )

  const handleColumnFilter = useCallback(
    (column: string, value: any) => {
      let filterColumn = column
      if (column === 'currency') filterColumn = 'currency'
      else if (column === 'language') filterColumn = 'language'
      else if (column === 'tastingType') filterColumn = 'tastingType'

      setFilters({
        [filterColumn]: value,
        page: 1,
      })
    },
    [setFilters]
  )

  const clearColumnFilters = useCallback(() => {
    const filtersToClear = ['currency', 'language', 'tastingType']

    filtersToClear.forEach(filter => {
      handleColumnFilter(filter, null)
    })

    handleSort(undefined)
    setFilters({ page: 1 })
  }, [handleColumnFilter, handleSort, setFilters])

  const onChangePagination = useCallback(
    (page: number) => {
      setFilters({ page })
    },
    [setFilters]
  )

  const startEditing = useCallback((event: MapEvent) => {
    setEditingEvent(event)
  }, [])

  const cancelEditing = useCallback(() => {
    setEditingEvent(null)
  }, [])

  const updateEvent = useCallback(
    async (params: UpdateEventListParams) => {
      await updateEventMutation.mutateAsync(params)
      eventQuery.refetch()
      setEditingEvent(null)
    },
    [updateEventMutation, eventQuery]
  )

  const transformEventForUpdate = (eventData: Partial<IUpdateEvent>): EventFormData => {
    return {
      id: eventData.id || undefined,
      theme: eventData.theme || '',
      restaurantName: eventData.restaurantName ?? '',
      locationLabel: eventData.locationLabel || '',
      latitude: eventData.latitude || '' || 0,
      longitude: eventData?.longitude || '' || 0,
      eventDate: eventData?.eventDate || '',
      eventTime: eventData?.eventTime || '',
      price: eventData.price || undefined || 0,
      currency: eventData.currency || 'UAH',
      speakerName: eventData.speakerName || '',
      language: eventData.language || 'UA',
      seats: eventData.seats || '' || 0,
      phoneNumber: eventData.phoneNumber || '',
      tastingType: eventData.tastingType || 'wine_set',
      repeatRule: eventData.repeatRule || 'never',
      isActive: eventData.isActive || true,
      isOnline: eventData.isOnline || false,
    }
  }

  const saveEventChanges = useCallback(
    async (updatedData: Partial<IUpdateEvent>) => {
      if (editingEvent?.id) {
        const updateData = transformEventForUpdate(updatedData)

        await updateEvent({
          id: editingEvent.id,
          data: updateData,
        })
      }
    },
    [editingEvent, updateEvent]
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

  const openCancelModal = useCallback(
    (eventId?: number) => {
      eventId && setSelectedEventId(eventId)

      if (!eventId) return
      const eventFound = findEventById(eventId)
      if (eventFound) {
        setEvent({
          theme: eventFound.theme || '',
          isCanceled: eventFound.isCanceled ?? false,
        })
      }

      setIsCancelModalOpen(true)
    },
    [findEventById]
  )

  const closeCancelModal = useCallback(() => {
    setIsCancelModalOpen(false)
    setSelectedEventId(null)
    setEvent({ theme: '', isCanceled: false })
  }, [])

  const confirmDeleteEvent = useCallback(async () => {
    if (deleteModal.eventId) {
      await deleteEvent(deleteModal.eventId)
    }
  }, [deleteModal.eventId, deleteEvent])

  const cancelEvent = useCallback(
    async (eventId: number, isCanceled: boolean) => {
      await cancelEventMutation.mutateAsync({ id: eventId, isCanceled })
      eventQuery.refetch()
    },
    [cancelEventMutation, eventQuery]
  )

  const cancelEventExistence = useCallback(async () => {
    if (selectedEventId) {
      await cancelEvent(selectedEventId, true)
      closeCancelModal()
    }
  }, [selectedEventId, cancelEvent, closeCancelModal])

  const rejectCancelEvent = useCallback(async () => {
    if (selectedEventId) {
      await cancelEvent(selectedEventId, false)
      closeCancelModal()
    }
  }, [selectedEventId, cancelEvent, closeCancelModal])

  return {
    events: mockList,
    // events: eventQuery.data?.rows,
    totalCount: eventQuery.data?.count,
    isLoading: eventQuery.isLoading,
    isFetching: eventQuery.isFetching,
    filters,
    searchValue,
    editingEvent,

    sortBy: filters.sortBy,
    handleSort,
    handleColumnFilter,
    clearColumnFilters,

    columnFilters: {
      currency: filters.currency,
      language: filters.language,
      tastingType: filters.tastingType,
    },

    onChangeSearch: handleSearchChange,
    handleClearSearch,
    onChangePagination,

    cancelEvent,
    confirmModal: {
      isOpen: isCancelModalOpen,
      selectedEventId,
      open: openCancelModal,
      close: closeCancelModal,
      reject: rejectCancelEvent,
      confirmCancel: cancelEventExistence,
    },
    eventToConfirm: event,

    startEditing,
    cancelEditing,
    saveEventChanges,
    isUpdating: updateEventMutation.isPending,

    deleteWine: openDeleteModal,
    isDeleting: deleteEventMutation.isPending,

    deleteModal: {
      ...deleteModal,
      onClose: closeDeleteModal,
      onSubmit: confirmDeleteEvent,
    },
  }
}
