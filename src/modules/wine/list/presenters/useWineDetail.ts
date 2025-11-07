import { useQuery } from '@tanstack/react-query'
import { wineListService } from '../entities/wine-list-service'

export const useWineDetail = (wineId: string) => {
  const wineQuery = useQuery({
    queryKey: ['wine', 'detail', wineId],
    queryFn: () => wineListService.detail(wineId),
    enabled: !!wineId,
  })

  return {
    wine: wineQuery.data?.data,
    isLoading: wineQuery.isLoading,
    refetch: wineQuery.refetch,
  }
}
