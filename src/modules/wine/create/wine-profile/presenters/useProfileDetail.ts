import { useQuery } from '@tanstack/react-query'
import { wineProfileQueries } from '../enteties/wine-profile-queries'

export const useProfileDetail = (profileId: string) => {
  const profileQuery = useQuery(wineProfileQueries.detail(profileId))

  const profile = profileQuery.data?.data

  return {
    profile,
    isLoadingDetail: profileQuery.isLoading,
    errorDetail: profileQuery.error,
    refetchDetail: profileQuery.refetch,
  }
}
