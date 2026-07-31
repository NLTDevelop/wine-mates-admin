import { CreateWineOfferForWineryParams, DeleteWineFromWineryParams, UpdateWineOfferForWineryParams, WineListEmptyWineryFilters, WineListFilters } from './types'
import { wineryWineListService } from './wine-list-service'

export const wineryWineListQueries = {
  listWine: (id: number, filters: WineListFilters) => ({
    queryKey: ['wineryWineList', 'list', filters],
    queryFn: () => wineryWineListService.list_wine(id, filters),
  }),

  listWineEmptyWinery: (filters: WineListEmptyWineryFilters) => ({
    queryKey: ['wineryWineList', 'list-empty-winery', filters],
    queryFn: () => wineryWineListService.list_wine_empty_winery(filters),
  }),

  addWine: () => ({
    mutationKey: ['wineryWineList', 'addWine'],
    mutationFn: (offers: CreateWineOfferForWineryParams[]) => wineryWineListService.create_offers(offers),
  }),

  createOffer: () => ({
    mutationKey: ['wineryWineList', 'createOffer'],
    mutationFn: (params: CreateWineOfferForWineryParams) => wineryWineListService.create_offer(params),
  }),

  updateOffer: () => ({
    mutationKey: ['wineryWineList', 'updateOffer'],
    mutationFn: (params: UpdateWineOfferForWineryParams) => wineryWineListService.update_offer(params),
  }),

  deleteWine: () => ({
    mutationKey: ['winery', 'deleteWine'],
    mutationFn: (body: DeleteWineFromWineryParams) => wineryWineListService.delete_wine(body),
  }),

  deleteOffer: () => ({
    mutationKey: ['wineryWineList', 'deleteOffer'],
    mutationFn: (id: number) => wineryWineListService.delete_offer(id),
  }),
}
