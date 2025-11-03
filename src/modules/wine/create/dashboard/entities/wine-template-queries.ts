import { ReorderWineTemplatesParams } from './types'
import { wineTemplateService } from './wine-template-service'

export const wineTemplateQueries = {
  list: () => ({
    queryKey: ['wine-templates', 'list'],
    queryFn: () => wineTemplateService.list(),
  }),

  reorder: () => ({
    mutationKey: ['wine-templates', 'reorder'],
    mutationFn: (params: ReorderWineTemplatesParams) => wineTemplateService.reorder(params),
  }),
}