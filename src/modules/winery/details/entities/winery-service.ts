/* global FormData */
import { api } from '@/services'
import { buildUrl } from '@/lib/utils'
import { ConfirmWineryParams, IWineryDetail, UpdateWineryParams } from './types'
import { WINERY_ENDPOINTS } from './winery-endpoints'

export const wineryService = {
  detail: (id: string | number): Promise<{ data: IWineryDetail }> => api.get(buildUrl(WINERY_ENDPOINTS.DETAIL, { id })),

  confirm: ({ id, body }: ConfirmWineryParams) => api.patch(buildUrl(WINERY_ENDPOINTS.CONFIRM, { wineryId: id }), body),

  update: ({ id, data }: UpdateWineryParams): Promise<IWineryDetail> => {
    const formData = new FormData()
    formData.append('winery', JSON.stringify(data))

    return api.patch(buildUrl(WINERY_ENDPOINTS.UPDATE, { id }), formData).then(response => response.data)
  },
}
