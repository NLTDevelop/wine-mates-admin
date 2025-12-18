import { useQuery } from '@tanstack/react-query'
import { wineQueries } from '../entities/wine-list-queries'

export const useWineDetail = (wineId: string) => {
  const wineQuery = useQuery(wineQueries.detail(wineId))

  return {
    wine: wineQuery.data?.data,
    isLoading: wineQuery.isLoading,
    refetch: wineQuery.refetch,
  }
}
