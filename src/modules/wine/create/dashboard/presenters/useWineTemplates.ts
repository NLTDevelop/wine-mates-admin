import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useWineTemplateStore } from '../entities/wine-template-store'
import { ReorderWineTemplatesParams, WineTemplate } from '../entities/types'
import { useEffect, useState } from 'react'
import { wineTemplateService } from '../entities/wine-template-service'
import { getWineTemplates } from './wine-templates'
import { useTranslation } from 'react-i18next'

export const useWineTemplates = () => {
  const queryClient = useQueryClient()
  const store = useWineTemplateStore()
  const { t } = useTranslation('wines')

  const [staticTemplates] = useState(() => getWineTemplates(t))

  const templatesQuery = useQuery({
    queryKey: ['wine-templates', 'list'],
    queryFn: () => wineTemplateService.list(),
    initialData: staticTemplates,
  })

  //-----------------когда будет бек---------------------
  // const templatesQuery = useQuery({
  //   queryKey: ['wine-templates', 'list'],
  //   queryFn: async () => {
  //     const backendData = await wineTemplateService.list()
  //     const staticTemplates = getWineTemplates(t)

  //     return backendData.map(backendItem => {
  //       const staticData = staticTemplates.find(t => t.id === backendItem.id)
  //       return {
  //         ...staticData,
  //         ...backendItem
  //       }
  //     })
  //   }
  // })

  useEffect(() => {
    if (templatesQuery.data) {
      store.setWineTemplates(templatesQuery.data)
    }
  }, [templatesQuery.data, store])

  const reorderMutation = useMutation({
    mutationKey: ['wine-templates', 'reorder'],
    mutationFn: (params: ReorderWineTemplatesParams) => wineTemplateService.reorder(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wine-templates', 'list'] })
    },
  })

  const handleReorderTemplates = (templates: WineTemplate[]) => {
    store.reorderTemplates(templates)

    const reorderParams: ReorderWineTemplatesParams = {
      templates: templates.map((template, index) => ({
        id: template.id,
        order: index,
      })),
    }

    reorderMutation.mutate(reorderParams)
  }

  return {
    templates: store.getSortedTemplates(),
    selectedTemplateType: store.selectedTemplateType,

    isLoading: templatesQuery.isLoading,
    isReordering: reorderMutation.isPending,

    setSelectedTemplateType: store.setSelectedTemplateType,
    reorderTemplates: handleReorderTemplates,

    getTemplateByType: store.getTemplateByType,
  }
}
