import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { eventQueries } from '../entities/event-queries'

export const useEventDetails = () => {
  const { id } = useParams<{ id: string }>()

  const { data, isLoading, error } = useQuery({
    ...eventQueries.detail(id!),
    enabled: !!id,
  })

  return {
    event: data?.data,
    isLoading,
    error,
  }
}
