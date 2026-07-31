import { api } from '@/services'
import {
  AddWineToWineryParams,
  CreateWineOfferForWineryParams,
  DeleteWineFromWineryParams,
  UpdateWineOfferForWineryParams,
  WineListEmptyWineryFilters,
  WineListFilters,
  WineListOfWineryResponse,
} from './types'
import { WINERY_WINE_LIST_ENDPOINTS } from './wine-list-endpoints'
import { buildUrl } from '@/lib/utils'
import { WinesResponse } from '@/modules/wine/list/entities/types/types'

export const wineryWineListService = {
  list_wine: (id: number, filters: WineListFilters): Promise<WineListOfWineryResponse> =>
    api.get(buildUrl(WINERY_WINE_LIST_ENDPOINTS.LIST_WINE, { id }), { params: filters }).then(response => response.data),

  list_wine_empty_winery: (filters: WineListEmptyWineryFilters): Promise<WinesResponse> =>
    api.get(WINERY_WINE_LIST_ENDPOINTS.LIST_WINE_EMPTY_WINERY, { params: filters }).then(response => response.data),

  add_wine: (body: AddWineToWineryParams) => api.post(WINERY_WINE_LIST_ENDPOINTS.ADD_WINE, body),

  delete_wine: (body: DeleteWineFromWineryParams) => api.delete(WINERY_WINE_LIST_ENDPOINTS.DELETE_WINE, { data: body }),

  create_offer: (body: CreateWineOfferForWineryParams) => api.post(WINERY_WINE_LIST_ENDPOINTS.CREATE_OFFER, body),

  create_offers: (offers: CreateWineOfferForWineryParams[]) => Promise.all(offers.map(offer => wineryWineListService.create_offer(offer))),

  update_offer: ({ id, data }: UpdateWineOfferForWineryParams) => api.patch(buildUrl(WINERY_WINE_LIST_ENDPOINTS.UPDATE_OFFER, { id }), data),

  delete_offer: (id: number) => api.delete(buildUrl(WINERY_WINE_LIST_ENDPOINTS.DELETE_OFFER, { id })),
}
