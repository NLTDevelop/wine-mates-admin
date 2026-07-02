import { api } from '@/services'
import { CUISINE_ENDPOINTS } from './cuisine-endpoints'
import { buildUrl } from '@/lib/utils'
import { ReorderItem } from '@/modules/wine/create/general/entities/types'
import { Country } from '@/modules/wine/create-wine/entities/types/location-types'

export interface CreateCuisineRequest {
  countryIds: number[]
}

export const cuisineService = {
  cuisine_list: (): Promise<Country[]> => api.get(CUISINE_ENDPOINTS.CUISINE_LIST).then(response => response.data),

  result_list: (): Promise<Country[]> => api.get(CUISINE_ENDPOINTS.RESULT_LIST).then(response => response.data),

  create: (params: CreateCuisineRequest): Promise<Country[]> => api.post(CUISINE_ENDPOINTS.CREATE, params).then(response => response.data),

  reorder: (params: ReorderItem[]): Promise<void> => api.patch(buildUrl(CUISINE_ENDPOINTS.REORDER), params).then(response => response.data),
}
