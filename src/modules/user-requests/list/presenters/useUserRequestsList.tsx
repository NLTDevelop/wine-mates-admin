import { keepPreviousData, useMutation, useQuery, UseQueryResult } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { useDebounce } from '@/hooks/ui/useDebounce'
import { useUserRequestsStore } from '../entities/user-requests-store'
import { UserRequestsResponse } from '../entities/types'
import { userRequestsQueries } from '../entities/user-requests-queries'
import { useTranslation } from 'react-i18next'
import { useToast } from '@/hooks/shadcn/use-toast'

export const useUserRequestsList = () => {
   const { t } = useTranslation('user_requests')
   const { toast } = useToast()

  const { filters, setFilters, resetFilters } = useUserRequestsStore()

  const [searchValue, setSearchValue] = useState<string>('')
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; requestId: number | null; theme: string }>({ isOpen: false, requestId: null, theme: '' })

  const userRequestsQuery: UseQueryResult<UserRequestsResponse | undefined, Error> = useQuery({
    ...userRequestsQueries.list(filters),
    placeholderData: keepPreviousData,
    staleTime: 2000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

    const deleteRequestMutation = useMutation({
    ...userRequestsQueries.delete(),
    onSuccess: () => {
      toast({
        title: t('request_deleted'),
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
    const filtersToClear = ['status']

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

    const deleteRequest = useCallback(
    async (requestId: string) => {
      await deleteRequestMutation.mutateAsync(requestId)
      userRequestsQuery.refetch()
      closeDeleteModal()
    },
    [deleteRequestMutation, userRequestsQuery]
  )

  const openDeleteModal = useCallback((requestId: number, theme: string = '') => {
    setDeleteModal({
      isOpen: true,
      requestId,
      theme,
    })
  }, [])

  const closeDeleteModal = useCallback(() => {
    setDeleteModal({
      isOpen: false,
      requestId: null,
      theme: '',
    })
  }, [])

   const confirmDeleteRequest = useCallback(async () => {
    if (deleteModal.requestId) {
      await deleteRequest(deleteModal.requestId.toString())
    }
  }, [deleteModal.requestId, deleteRequest])

  return {
    userRequests: userRequestsQuery.data?.rows,
    totalCount: userRequestsQuery.data?.count,
    isLoading: userRequestsQuery.isLoading,
    isFetching: userRequestsQuery.isFetching,
    filters,
    searchValue,

    handleColumnFilter,
    clearColumnFilters,

    columnFilters: {
      status: filters.status,
    },

    onChangeSearch: handleSearchChange,
    handleClearSearch,
    onChangePagination,

     deleteRequest: openDeleteModal,
    isDeleting: deleteRequestMutation.isPending,

    deleteModal: {
      ...deleteModal,
      onClose: closeDeleteModal,
      onSubmit: confirmDeleteRequest,
    },
  }
}
