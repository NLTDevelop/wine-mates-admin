import { useToast } from '@/hooks/shadcn/use-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { FeatureConfig, FeatureUpdateConfig, GeminiFeatureConfig, GeminiUpdateConfig, OpenAIFeatureConfig, OpenAIUpdateConfig } from '../entities/types'
import { promtQueries } from '../entities/promt-queries'
import { usePromtStore } from '../entities/promt-store'

export const useUpdateAiPromtsForm = () => {
  const { toast } = useToast()
  const { t } = useTranslation('promt')
  const queryClient = useQueryClient()
  const { activeTab } = usePromtStore()

  const updateMutation = useMutation<FeatureConfig, Error, FeatureUpdateConfig, { prevData: FeatureConfig | undefined }>({
    mutationFn: async (params: FeatureUpdateConfig): Promise<FeatureConfig> => {
      if (activeTab === 'scanner') {
        return promtQueries.scanner.update(params as GeminiUpdateConfig).queryFn() as Promise<GeminiFeatureConfig>
      } else {
        if (activeTab === 'snacks') {
          return promtQueries.snacks.update(params as OpenAIUpdateConfig).queryFn() as Promise<OpenAIFeatureConfig>
        } else {
          return promtQueries.tasting_note.update(params as OpenAIUpdateConfig).queryFn() as Promise<OpenAIFeatureConfig>
        }
      }
    },

    onMutate: async params => {
      await queryClient.cancelQueries({ queryKey: [activeTab, 'list'] })
      await queryClient.cancelQueries({ queryKey: [activeTab, 'reset'] })

      const prevData = queryClient.getQueryData<FeatureConfig>([activeTab, 'list'])

      queryClient.setQueryData<FeatureConfig>([activeTab, 'list'], old => {
        if (!old) return old
        return {
          ...old,
          config: params.config,
        } as FeatureConfig
      })

      return { prevData }
    },

    onSuccess: data => {
      toast({ title: t('updated'), variant: 'default' })

      queryClient.setQueryData<FeatureConfig>([activeTab, 'list'], old => {
        if (!old) return data
        return {
          ...old,
          config: data.config,
        } as FeatureConfig
      })

      queryClient.invalidateQueries({ queryKey: [activeTab, 'list'], refetchType: 'none' })
    },

    onError: (_, __, context) => {
      if (context?.prevData) {
        queryClient.setQueryData([activeTab, 'list'], context.prevData)
      }
    },
  })

  const onSubmit = async (formData: any) => {
    await updateMutation.mutateAsync(formData)
  }

  return { onSubmit, isPending: updateMutation.isPending }
}
