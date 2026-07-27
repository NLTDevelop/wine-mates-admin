/* global File, FormData */
import { api } from '@/services'
import { buildUrl } from '@/lib/utils'
import { ConfirmWineryParams, IWineryDetail, UpdateWineryParams } from './types'
import { WINERY_ENDPOINTS } from './winery-endpoints'

export const wineryService = {
  detail: (id: string | number): Promise<{ data: IWineryDetail }> => api.get(buildUrl(WINERY_ENDPOINTS.DETAIL, { id })),

  confirm: ({ id, body }: ConfirmWineryParams) => api.patch(buildUrl(WINERY_ENDPOINTS.CONFIRM, { wineryId: id }), body),

  update: ({ id, data }: UpdateWineryParams): Promise<IWineryDetail> => {
    const formData = new FormData()
    formData.append('winery', JSON.stringify(data.winery))

    if (data.image instanceof File) {
      formData.append('image', data.image)
    }

    if (data.files?.length) {
      data.files.forEach(file => {
        formData.append('files', file)
      })
    }

    if (data.removeMainPhoto) {
      formData.append('removeMainPhoto', String(data.removeMainPhoto))
    }

    if (data.removeGalleryFileIds?.length) {
      data.removeGalleryFileIds.forEach(id => {
        formData.append('removeGalleryFileIds', String(id))
      })
    }

    return api.patch(buildUrl(WINERY_ENDPOINTS.UPDATE, { id }), formData).then(response => response.data)
  },
}
