import { api } from '@/services'
import { WINERIES_LIST_ENDPOINTS } from './wineries-list-endpoints'
import {  WineryFilters, WineriesResponse } from './types'


export const wineriesListService = {
  list: (filters: WineryFilters): Promise<WineriesResponse> => api.get(WINERIES_LIST_ENDPOINTS.LIST, { params: filters }).then(response => response.data),
 }
