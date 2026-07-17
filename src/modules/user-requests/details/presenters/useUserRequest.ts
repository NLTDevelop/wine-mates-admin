import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { userRequestQueries } from '../entities/user-request-queries'
import { PATHS } from '@/navigation/paths'

export const useUserRequest = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, isLoading, error } = useQuery({
    ...userRequestQueries.detail(id!),
  })

  const handleBack = () => navigate(PATHS.USER_REQUESTS)

  return {
    userRequest: data?.data,
    isLoading,
    error,
    handleBack,
  }
}
