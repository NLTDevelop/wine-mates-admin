import { api } from '@/services'
import { buildUrl } from '@/lib/utils'
import { AddWineToWineryParams, ConfirmWineryParams, IWineryDetail } from './types'
import { WINERY_ENDPOINTS } from './winery-endpoints'

export const wineryService = {
  detail: (id: string | number): Promise<{ data: IWineryDetail }> => api.get(buildUrl(WINERY_ENDPOINTS.DETAIL, { id })),

  confirm: ({ id, body }: ConfirmWineryParams) => api.patch(buildUrl(WINERY_ENDPOINTS.CONFIRM, { wineryId: id }), body),

  add_wine: ({ id, body }: AddWineToWineryParams) => api.patch(buildUrl(WINERY_ENDPOINTS.ADD_WINE, { wineryId: id }), body),

  delete_wine: ({ id }: { id: string }) => api.patch(buildUrl(WINERY_ENDPOINTS.DELETE_WINE, { wineryId: id })),
}
