import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { userRequestQueries } from '../entities/user-request-queries'

export const useUserRequest = () => {
  const { id } = useParams<{ id: string }>()

  const { data, isLoading, error } = useQuery({
    ...userRequestQueries.detail(id!),
  })

  return {
    userRequest: data,
    isLoading,
    error,
  }
}
