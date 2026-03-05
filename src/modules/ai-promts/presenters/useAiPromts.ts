import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo } from 'react'
import { usePromtStore } from '../entities/promt-store'
import { FeatureConfig, FeatureType } from '../entities/types'
import { promtQueries } from '../entities/promt-queries'
import { useAiPromtForm } from './useAiPromtForm'
import { useUpdateAiPromtsForm } from './useUpdateAiPromtsForm'
import { IOption } from '@/UIKit/components/NLTFormCombobox'

export const useAiPromts = () => {
  const { activeTab, setActiveTab } = usePromtStore()
  const { form, isScanner } = useAiPromtForm(activeTab)
  const { onSubmit, isPending } = useUpdateAiPromtsForm()

  const promtQuery = useQuery<FeatureConfig>(promtQueries[activeTab].list())

  const promtQueryInit = useQuery<FeatureConfig>({ ...promtQueries[activeTab].reset(), enabled: false, queryKey: [activeTab, 'reset'] })

  useEffect(() => {
    if (promtQuery.data && !isPending) {
      const currentValues = form.getValues()
      const newConfig = promtQuery.data.config
      if (JSON.stringify(currentValues) !== JSON.stringify(newConfig)) {
        form.reset(newConfig)
      }
    }
  }, [promtQuery.data, activeTab, form, isPending])

  const handleReset = async () => {
    const result = await promtQueryInit.refetch()
    if (result.data) {
      form.reset(result.data.config)
    }
  }

  const handleTabChange = useCallback(
    (tab: FeatureType) => {
      setActiveTab(tab)
    },
    [setActiveTab]
  )

  const modelOptions = useMemo<IOption[]>(() => {
    return (
      promtQuery?.data?.availableModels?.map(model => ({
        value: model,
        label: model,
      })) || []
    )
  }, [promtQuery?.data?.availableModels])

  const fetchOptions = useCallback(
    async (search?: string) => {
      if (search && search.trim()) {
        const term = search.toLowerCase()
        return modelOptions.filter(opt => opt.label.toLowerCase().includes(term))
      }
      return modelOptions
    },
    [modelOptions]
  )

  return {
    data: promtQuery.data,
    form,
    isScanner,
    isLoading: promtQuery.isLoading,
    isError: promtQuery.isError,
    error: promtQuery.error,
    activeTab,
    onChangeTab: handleTabChange,
    fetchOptions,
    modelOptions,
    handleReset,
    onSubmit,
  }
}
