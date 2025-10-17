import { useUserStore } from '@/modules/users/entity/user-store'
import { useMutation, useQuery } from '@tanstack/react-query'
import { userQueries } from '../entity/user-queries'
import { useCallback } from 'react'

export const useUsers = () => {
  const { filters, setFilters } = useUserStore()

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

  const changeUserCategory = useCallback(
    async (userId: string, category: string, note?: string) => {
      await updateCategoryMutation.mutateAsync({ id: userId, category, note })
      usersQuery.refetch()
    },
    [updateCategoryMutation, usersQuery]
  )

  return {
    users: usersQuery.data?.data,
    isLoading: usersQuery.isLoading,
    filters,
    onChangeSearch,
    onChangePagination,
    changeUserCategory,
    isChangingStatus: updateCategoryMutation.isPending,
  }
}
