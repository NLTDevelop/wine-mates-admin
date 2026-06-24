import { useQuery } from '@tanstack/react-query'
import { wineQueries } from '../entities/wine-list-queries'

export const useWineDetail = (wineId: string) => {
  const wineQuery = useQuery(wineQueries.detail(wineId))

  const wine = wineQuery.data?.data

  const isEmptyData = !wine?.statistics?.topColor.length || !wine?.statistics?.topAromas.length || !wine?.statistics?.topFlavors.length || !wine?.statistics?.tasteCharacteristics.length

  return {
    wine,
    isLoading: wineQuery.isLoading,
    refetch: wineQuery.refetch,
    isEmptyData,
  }
}
