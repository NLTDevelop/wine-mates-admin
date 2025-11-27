import { useWineTemplateStore } from '../entities/wine-template-store'
import { WineTemplate } from '../entities/types'
import { useEffect } from 'react'
import { getWineTemplates } from './wine-templates'
import { useTranslation } from 'react-i18next'

export const useWineTemplates = () => {
  const store = useWineTemplateStore()
  const { t } = useTranslation('wines')

  // ============ пока нет бека ============
  const wineTemplates = useWineTemplateStore(state => state.wineTemplates)
  const setWineTemplates = useWineTemplateStore(state => state.setWineTemplates)
  const reorderTemplates = useWineTemplateStore(state => state.reorderTemplates)

  useEffect(() => {
    if (wineTemplates.length === 0) {
      const staticTemplates = getWineTemplates(t)
      console.log(
        'Setting initial templates:',
        staticTemplates.map(t => t.type)
      )
      setWineTemplates(staticTemplates)
    }
  }, [t, wineTemplates.length, setWineTemplates])

  const handleReorderTemplates = (templates: WineTemplate[]) => {
    console.log(
      'Reordering templates to:',
      templates.map(t => t.type)
    )
    reorderTemplates(templates)
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
    templates: wineTemplates,
    selectedTemplateType: store.selectedTemplateType,

    isLoading: false, // для локального
    isReordering: false,

    setSelectedTemplateType: store.setSelectedTemplateType,
    reorderTemplates: handleReorderTemplates,

    getTemplateByType: store.getTemplateByType,
  }
}
