import { api } from '@/services'
import { buildUrl } from '@/lib/utils'
import { AddWineToWineryParams, ConfirmWineryParams, IWineryDetail, ListWineFilters, WineListOfWineryResponse } from './types'
import { WINERY_ENDPOINTS } from './winery-endpoints'

export const wineryService = {
  detail: (id: string | number): Promise<{ data: IWineryDetail }> => api.get(buildUrl(WINERY_ENDPOINTS.DETAIL, { id })),

  confirm: ({ id, body }: ConfirmWineryParams) => api.patch(buildUrl(WINERY_ENDPOINTS.CONFIRM, { wineryId: id }), body),

  list_wine: (filters: ListWineFilters): Promise<WineListOfWineryResponse> => api.get(WINERY_ENDPOINTS.LIST_WINE, { params: filters }).then(response => response.data),//TODO add type

  add_wine: (body: AddWineToWineryParams) => api.patch(WINERY_ENDPOINTS.ADD_WINE, body),

  delete_wine: (body: AddWineToWineryParams) => api.delete(WINERY_ENDPOINTS.DELETE_WINE, { data: body }),
}
