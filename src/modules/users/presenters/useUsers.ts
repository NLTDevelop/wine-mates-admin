import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { useDebounce } from '@/hooks/ui/useDebounce'
import { useUserStore } from '../entities/user-store'
import { userQueries } from '../entities/user-queries'
import { IUserResponse, IUserTable } from '../entities/IUser'

export const useUsers = () => {
  const { filters, setFilters, resetFilters } = useUserStore()

  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [searchValue, setSearchValue] = useState<string>('')
  const [user, setUser] = useState<{
    userFullName: string
    category: string
    isConfirm: boolean
  }>({
    userFullName: '',
    category: '',
    isConfirm: false,
  })

  const usersQuery: UseQueryResult<IUserResponse, Error> = useQuery(userQueries.list(filters))
  const confirmCategoryMutation = useMutation(userQueries.confirmCategory())

  const { debouncedWrapper } = useDebounce((searchValue: string) => {
    setFilters({ search: searchValue, offset: 0 })
  }, 500)

  const findUserById = useCallback(
    (userId: string) => {
      return usersQuery.data?.rows.find((user: IUserTable) => user.id === userId)
    },
    [usersQuery.data?.rows]
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
  }, [setFilters])

  const onChangePagination = useCallback(
    (offset: number) => {
      setFilters({ offset })
    },
    [setFilters]
  )

  const openChangeModal = useCallback(
    (userId: string) => {
      setSelectedUserId(userId)

      const userFound = findUserById(userId)
      if (userFound) {
        setUser({
          userFullName: `${userFound.firstName} ${userFound.lastName}`,
          category: userFound.wineExperienceLevel,
          isConfirm: userFound.isConfirmed ?? false,
        })
      }

      setIsChangeModalOpen(true)
    },
    [findUserById]
  )

  const closeChangeModal = useCallback(() => {
    setIsChangeModalOpen(false)
    setSelectedUserId(null)
    setUser({ userFullName: '', category: '', isConfirm: false })
  }, [])

  const confirmUserCategory = useCallback(
    async (userId: string, isConfirmed: boolean) => {
      await confirmCategoryMutation.mutateAsync({ id: userId, isConfirmed })
      usersQuery.refetch()
    },
    [confirmCategoryMutation, usersQuery]
  )

  const confirmCategory = useCallback(async () => {
    if (selectedUserId) {
      await confirmUserCategory(selectedUserId, true)
      closeChangeModal()
    }
  }, [selectedUserId, confirmUserCategory, closeChangeModal])

  const rejectCategory = useCallback(async () => {
    if (selectedUserId) {
      await confirmUserCategory(selectedUserId, false)
      closeChangeModal()
    }
  }, [selectedUserId, confirmUserCategory, closeChangeModal])

  return {
    users: usersQuery.data?.rows,
    isLoading: usersQuery.isLoading,
    filters,
    searchValue,
    onChangeSearch: handleSearchChange,
    handleClearSearch,
    onChangePagination,
    confirmUserCategory,
    userToConfirm: user,
    isChangingStatus: confirmCategoryMutation.isPending,
    modal: {
      isOpen: isChangeModalOpen,
      selectedUserId,
      open: openChangeModal,
      close: closeChangeModal,
      reject: rejectCategory,
      confirm: confirmCategory,
    },
  }
}
