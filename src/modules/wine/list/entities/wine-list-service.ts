import { api } from '@/services'
import { buildUrl } from '@/lib/utils'
import { WINE_LIST_ENDPOINTS } from './wine-list-endpoints'
import { ConfirmWineParams, IWines, UpdateWineListParams, WineFilters, CreateWineRequest } from './types/types'
import { mockWinesResponse } from './mock'

const USE_MOCK_DATA = true

export const wineListService = {
  detail: (id: string | number): Promise<{ data: IWines }> => api.get(buildUrl(WINE_LIST_ENDPOINTS.DETAIL, { id })),

  list: (filters: WineFilters) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve(mockWinesResponse)
    }

    api.get(WINE_LIST_ENDPOINTS.LIST, { params: filters }).then(response => response.data)
  },

  create: (wineData: CreateWineRequest): Promise<IWines> => {
    const formData = new FormData()

    Object.keys(wineData).forEach(key => {
      if (key !== 'images') {
        const value = wineData[key as keyof CreateWineRequest]
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString())
        }
      }
    })

    wineData.images.forEach(image => {
      formData.append('images', image)
    })

    return api
      .post(WINE_LIST_ENDPOINTS.CREATE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(response => response.data)
  },

  confirm: ({ id, isConfirmed }: ConfirmWineParams) => api.patch(buildUrl(WINE_LIST_ENDPOINTS.CONFIRM, { id }), { isConfirmed }),

  update: ({ id, data }: UpdateWineListParams) => api.patch(buildUrl(WINE_LIST_ENDPOINTS.UPDATE, { id }), { data }),

  delete: (colorId: string): Promise<void> => api.delete(buildUrl(WINE_LIST_ENDPOINTS.DELETE, { colorId })).then(response => response.data),

  import: (file: File): Promise<void> => {
    const formData = new FormData()
    formData.append('file', file)

    return api.post(WINE_LIST_ENDPOINTS.IMPORT, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(response => response.data)
  },
}
