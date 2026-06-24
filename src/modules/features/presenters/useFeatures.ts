import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query'
import { useFeatureStore } from '../enteties/feature-store'
import { Feature } from '../enteties/types'
import { featureQueries } from '../enteties/feature-queries'
import { queryClient } from '@/lib/react-query'

export const useFeatures = () => {
  const setFeatures = useFeatureStore(state => state.setFeatures)

  const featuresQuery: UseQueryResult<Feature[], Error> = useQuery(featureQueries.list())

  if (featuresQuery.data) {
    setFeatures(featuresQuery.data)
  }

  const updateToggleMutation = useMutation({
    ...featureQueries.updateToggle(),
    onMutate: async ({ key, isEnabled }: { key: Feature['key']; isEnabled: boolean }) => {
      await queryClient.cancelQueries({ queryKey: ['features', 'list'] })

      const previousFeatures = queryClient.getQueryData<Feature[]>(['features', 'list'])

      const updatedFeatures = previousFeatures?.map(feature => (feature.key === key ? { ...feature, isEnabled } : feature)) || []

      queryClient.setQueryData<Feature[]>(['features', 'list'], updatedFeatures)

      return { previousFeatures }
    },
    onError: (_, __, context) => {
      if (context?.previousFeatures) {
        queryClient.setQueryData<Feature[]>(['features', 'list'], context.previousFeatures)
      }
    },
    onSuccess: (data, variables) => {
      const currentFeatures = queryClient.getQueryData<Feature[]>(['features', 'list'])
      const updatedFeature = currentFeatures?.find(f => f.key === variables.key)

      if (updatedFeature) {
        const serverSyncedFeature: Feature = {
          ...updatedFeature,
          ...data,
        }

        queryClient.setQueryData<Feature[]>(['features', 'list'], features => features?.map(f => (f.key === variables.key ? serverSyncedFeature : f)))
      }
    },
    onSettled: () => {
      queryClient.getQueryData<Feature[]>(['features', 'list'])
    },
  })

  const onToggle = async (key: Feature['key'], isEnabled: boolean) => {
    await updateToggleMutation.mutateAsync({ key, isEnabled })
  }

  return {
    features: featuresQuery.data,
    isLoading: featuresQuery.isLoading,
    isUpdating: updateToggleMutation.isPending,
    onToggle,
  }
}
