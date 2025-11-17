import { api } from '@/services'
import { buildUrl } from '@/lib/utils'
import { WINE_TYPE_ENDPOINTS } from './wine-type-endpoints'
import { WineType, UpdateWineTypeParams, CreateWineTypeRequest, WineTypeResponse } from './types/wine-type'
import { WineTypeFilters } from './wine-type-queries'
import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'

export const wineTypeService = {
  list: (filters: WineTypeFilters = {}): Promise<WineTypeResponse> => {
    const params: any = {}

    if (filters.include && filters.include.length > 0) {
      params.include = filters.include
    }

    return api.get(WINE_TYPE_ENDPOINTS.LIST, { params }).then(response => {
      const data = response.data

      if (Array.isArray(data)) {
        let filteredData = data

        if (filters.search) {
          const searchLower = filters.search.toLowerCase()
          filteredData = data.filter(wt => wt.nameUa.toLowerCase().includes(searchLower) || wt.nameEn?.toLowerCase().includes(searchLower))
        }

        const start = filters.offset || 0
        const end = start + (filters.limit || DEFAULT_PAGINATION_LIMIT)
        const paginatedData = filteredData.slice(start, end)

        return {
          rows: paginatedData,
          count: filteredData.length,
        }
      }

      return data
    })
  },

  create: (wineType: CreateWineTypeRequest): Promise<WineType> => api.post(WINE_TYPE_ENDPOINTS.CREATE, wineType).then(response => response.data),

  update: (params: UpdateWineTypeParams): Promise<WineType> =>
    api.patch(buildUrl(WINE_TYPE_ENDPOINTS.UPDATE, { wineTypeValue: params.wineTypeId }), params.newWineType).then(response => response.data),

  delete: (wineTypeValue: string): Promise<void> => api.delete(buildUrl(WINE_TYPE_ENDPOINTS.DELETE, { wineTypeValue })).then(response => response.data),
}
