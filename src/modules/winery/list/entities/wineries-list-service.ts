import { api } from '@/services'
import { buildUrl } from '@/lib/utils'
import { WINERIES_LIST_ENDPOINTS } from './wineries-list-endpoints'
import { IWinery, WineryFilters, WineriesResponse, ConfirmWineryParams } from './types'


export const wineriesListService = {
  detail: (id: string | number): Promise<{ data: IWinery }> => api.get(buildUrl(WINERIES_LIST_ENDPOINTS.DETAIL, { id })),

  list: (filters: WineryFilters): Promise<WineriesResponse> => api.get(WINERIES_LIST_ENDPOINTS.LIST, { params: filters }).then(response => response.data),

  confirm: ({ id, status }: ConfirmWineryParams) => api.patch(buildUrl(WINERIES_LIST_ENDPOINTS.CONFIRM, { id }), { status }),

}
