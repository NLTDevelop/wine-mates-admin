import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query'
import { useFeatureStore } from '../enteties/feature-store'
import { Feature } from '../enteties/types'
import { featureQueries } from '../enteties/feature-queries'
import { queryClient } from '@/lib/react-query'
import { useState } from 'react'
import { boolean } from 'zod'

export const useFeatures = () => {
  const setFeatures = useFeatureStore(state => state.setFeatures)
  const setFeatureToggle = useFeatureStore(state => state.setFeatureToggle)

  const featuresQuery: UseQueryResult<Feature[], Error> = useQuery(featureQueries.list())

  if (featuresQuery.data) {
    setFeatures(featuresQuery.data)
  }

  const updateToggleMutation = useMutation(featureQueries.updateToggle())


  const onToggle = async (key: Feature['key'], is_enabled: boolean) => {
    console.log("Toggle clicked - Key:", key, "New status:", is_enabled)
    // const updatedFeature = await updateToggleMutation.mutateAsync({ key, is_enabled })

    // queryClient.setQueryData<Feature[]>(['features', 'list'], oldFeatures => {
    //   if (!oldFeatures) return [updatedFeature]
    //   return oldFeatures.map(f => (f.key === updatedFeature.key ? updatedFeature : f))
    // })

    // setFeatureToggle(updatedFeature.key, updatedFeature.is_enabled)
  }

  return {
    features: featuresQuery.data,
    isLoading: featuresQuery.isLoading,
    isUpdating: updateToggleMutation.isPending,
    onToggle,
  }
}
