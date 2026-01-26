import { api } from '@/services'
import { buildUrl } from '@/lib/utils'
import { WINE_LIST_ENDPOINTS } from './wine-list-endpoints'
import { ConfirmWineParams, CreateWineRequest, IReviewDetail, IWines, ReviewFilters, ReviewsResponse, UpdateWineListParams, WineFilters, WinesResponse } from './types/types'
import { WineFormData } from '../../create-taste/presenters/wine-form-schema'
import { mapFormDataToUpdateRequestSimple } from '../../create-taste/presenters/useWineForm'

export const wineListService = {
  detail: (id: string | number): Promise<{ data: IWines }> => api.get(buildUrl(WINE_LIST_ENDPOINTS.DETAIL, { id })),

  list: (filters: WineFilters): Promise<WinesResponse> => api.get(WINE_LIST_ENDPOINTS.LIST, { params: filters }).then(response => response.data),

  create: (wineData: CreateWineRequest): Promise<IWines> => {
    const formData = new FormData()

    Object.keys(wineData).forEach(key => {
      if (key !== 'image') {
        const value = wineData[key as keyof WineFormData]
        if (value !== undefined && value !== null && value !== '') {
          formData.append(key, value.toString())
        }
      }
    })

    if (wineData.image) {
      if (wineData.image instanceof File) {
        formData.append('image', wineData.image)
      } else if ('url' in wineData.image) {
        formData.append('imageId', wineData.image.id)
      }
    }

    return api.post(WINE_LIST_ENDPOINTS.CREATE, formData).then(response => response.data)
  },
  confirm: ({ id, isConfirmed }: ConfirmWineParams) => api.patch(buildUrl(WINE_LIST_ENDPOINTS.CONFIRM, { id }), { isConfirmed }),

  update: ({ id, data }: UpdateWineListParams) => {
    const formData = mapFormDataToUpdateRequestSimple(data)

    return api.patch(buildUrl(WINE_LIST_ENDPOINTS.UPDATE, { id }), formData).then(response => response.data)
  },

  delete: (id: string): Promise<void> => api.delete(buildUrl(WINE_LIST_ENDPOINTS.DELETE, { id })).then(response => response.data),

  import: (file: File): Promise<void> => {
    const formData = new FormData()
    formData.append('file', file)

    return api.post(WINE_LIST_ENDPOINTS.IMPORT, formData).then(response => response.data)
  },

  reviews: (filters: ReviewFilters): Promise<ReviewsResponse> => api.get(WINE_LIST_ENDPOINTS.RATES, { params: filters }).then(response => response.data),

  review_detail: (id: string | number): Promise<{ data: IReviewDetail }> => api.get(buildUrl(WINE_LIST_ENDPOINTS.RATE_DETAIL, { id })),
}
