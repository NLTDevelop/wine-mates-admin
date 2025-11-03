import { useQuery } from '@tanstack/react-query'
import { userQueries } from '../entities/user-queries'

export const useUserDetail = (id: string) => {
  const userQuery = useQuery(userQueries.detail(id))

  return {
    user: userQuery.data?.data,
    isLoading: userQuery.isLoading,
    isError: userQuery.isError,
    error: userQuery.error,
    refetch: userQuery.refetch,
  }
}
