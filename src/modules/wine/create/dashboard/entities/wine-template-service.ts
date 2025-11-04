import { api } from '@/services'
import { WINE_TEMPLATE_ENDPOINTS } from './wine-template-endpoints'
import { ReorderWineTemplatesParams, WineTemplate } from './types'

export const wineTemplateService = {
  list: (): Promise<WineTemplate[]> => api.get(WINE_TEMPLATE_ENDPOINTS.LIST).then(response => response.data),

  reorder: (params: ReorderWineTemplatesParams): Promise<void> => api.patch(WINE_TEMPLATE_ENDPOINTS.REORDER, params).then(response => response.data),
}
