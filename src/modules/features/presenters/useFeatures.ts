import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query'
import { useFeatureStore } from '../enteties/feature-store'
import { Feature } from '../enteties/types'
import { featureQueries } from '../enteties/feature-queries'
import { queryClient } from '@/lib/react-query'

export const useFeatures = () => {
  const setFeatures = useFeatureStore(state => state.setFeatures)
  const setFeatureToggle = useFeatureStore(state => state.setFeatureToggle)

  const featuresQuery: UseQueryResult<Feature[], Error> = useQuery(featureQueries.list())

  if (featuresQuery.data) {
    setFeatures(featuresQuery.data)
  }

  const updateToggleMutation = useMutation(featureQueries.updateToggle())

  const onToggle = async (key: Feature['key'], isEnabled: boolean) => {
    // console.log('Toggle clicked - Key:', key, 'New status:', isEnabled)
    await updateToggleMutation.mutateAsync({ key, isEnabled })

    const oldFeatures = queryClient.getQueryData<Feature[]>(['features', 'list'])

    const oldFeature = oldFeatures?.find(f => f.key === key)

    if (oldFeature) {
      const updatedFeature: Feature = {
        ...oldFeature,
        key: key,
        isEnabled: isEnabled,
      }

      queryClient.setQueryData<Feature[]>(['features', 'list'], features => {
        if (!features) return [updatedFeature]
        return features.map(f => (f.key === updatedFeature.key ? updatedFeature : f))
      })

      setFeatureToggle(updatedFeature.key, updatedFeature.isEnabled)
    } else {
      console.error(`Feature with key ${key} not found in query cache.`)
      queryClient.invalidateQueries({ queryKey: ['features', 'list'] })
    }
  }

  return {
    features: featuresQuery.data,
    isLoading: featuresQuery.isLoading,
    isUpdating: updateToggleMutation.isPending,
    onToggle,
  }
}
