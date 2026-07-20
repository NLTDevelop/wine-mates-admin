import { api } from '@/services'
import { buildUrl } from '@/lib/utils'
import {  ConfirmWineryParams,  IWineryDetail } from './types'
import { WINERY_ENDPOINTS } from './winery-endpoints'

export const wineryService = {
  detail: (id: string | number): Promise<{ data: IWineryDetail }> => api.get(buildUrl(WINERY_ENDPOINTS.DETAIL, { id })),

  confirm: ({ id, body }: ConfirmWineryParams) => api.patch(buildUrl(WINERY_ENDPOINTS.CONFIRM, { wineryId: id }), body),

}
