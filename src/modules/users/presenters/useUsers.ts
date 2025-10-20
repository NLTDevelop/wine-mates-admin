import { useUserStore } from '@/modules/users/entity/user-store'
import { useMutation, useQuery } from '@tanstack/react-query'
import { userQueries } from '../entity/user-queries'
import { useCallback, useState } from 'react'

export const useUsers = () => {
  const { filters, setFilters } = useUserStore()

  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [userStatusChangeNote, setUserStatusChangeNote] = useState('')

  const usersQuery = useQuery(userQueries.list(filters))
  const updateCategoryMutation = useMutation(userQueries.updateCategory())

  const onChangeSearch = useCallback(
    (search: string) => {
      setFilters({ search, offset: 0 })
    },
    [setFilters]
  )

  const onChangePagination = useCallback(
    (offset: number) => {
      setFilters({ offset })
    },
    [setFilters]
  )

  const openChangeModal = useCallback((userId: string) => {
    setSelectedUserId(userId)
    setIsChangeModalOpen(true)
  }, [])

  const closeChangeModal = useCallback(() => {
    setIsChangeModalOpen(false)
    setSelectedUserId(null)
    setUserStatusChangeNote('')
  }, [])

  const changeUserCategory = useCallback(
    async (userId: string, category: string, note?: string) => {
      await updateCategoryMutation.mutateAsync({ id: userId, category, note })
      usersQuery.refetch()
    },
    [updateCategoryMutation, usersQuery]
  )

  const confirmCategoryChange = useCallback(async () => {
    if (selectedUserId) {
      await changeUserCategory(selectedUserId, 'new_category', userStatusChangeNote)
      closeChangeModal()
    }
  }, [selectedUserId, userStatusChangeNote, changeUserCategory, closeChangeModal])

  return {
    users: usersQuery.data?.data,
    isLoading: usersQuery.isLoading,
    filters,
    onChangeSearch,
    onChangePagination,
    changeUserCategory,
    isChangingStatus: updateCategoryMutation.isPending,
    modal: {
      isOpen: isChangeModalOpen,
      selectedUserId,
      note: userStatusChangeNote,
      setNote: setUserStatusChangeNote,
      open: openChangeModal,
      close: closeChangeModal,
      confirm: confirmCategoryChange,
    }
  }
}
