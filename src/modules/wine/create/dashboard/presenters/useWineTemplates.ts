import { useWineTemplateStore } from '../entities/wine-template-store'
import { WineTemplate } from '../entities/types'
import { useEffect } from 'react'
import { getWineTemplates } from './wine-templates'
import { useTranslation } from 'react-i18next'

export const useWineTemplates = () => {
  const store = useWineTemplateStore()
  const { t } = useTranslation('wines')

  // ============ пока нет бека ============
  useEffect(() => {
    if (store.wineTemplates.length === 0) {
      const staticTemplates = getWineTemplates(t)
      store.setWineTemplates(staticTemplates)
    }
  }, [t, store])

  const handleReorderTemplates = (templates: WineTemplate[]) => {
    store.reorderTemplates(templates)
  }

  // ============ когда будет бек ============
  /*
  const queryClient = useQueryClient()
  
  const templatesQuery = useQuery({
    queryKey: ['wine-templates', 'list'],
    queryFn: async () => {
      const templatesData = await wineTemplateService.list()
      const staticTemplates = getWineTemplates(t)

      return templatesData.map(templateItem => {
        const staticData = staticTemplates.find(t => t.id === templateItem.id)
        return {
          ...staticData,
          ...templateItem
        }
      })
    }
  })

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
    const reorderParams: ReorderWineTemplatesParams = {
      templates: templates.map((template, index) => ({
        id: template.id,
        order: index,
      })),
    }
    reorderMutation.mutate(reorderParams)
  }
  */

  return {
    templates: store.wineTemplates,
    selectedTemplateType: store.selectedTemplateType,

    isLoading: false, // для локального
    isReordering: false,

    setSelectedTemplateType: store.setSelectedTemplateType,
    reorderTemplates: handleReorderTemplates,

    getTemplateByType: store.getTemplateByType,
  }
}
