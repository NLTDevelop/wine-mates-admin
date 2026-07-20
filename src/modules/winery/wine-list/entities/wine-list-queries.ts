import { AddWineToWineryParams, DeleteWineFromWineryParams, WineListEmptyWineryFilters, WineListFilters } from './types'
import { wineryWineListService } from './wine-list-service'

export const wineryWineListQueries = {
  listWine: (id:number,filters: WineListFilters) => ({
    queryKey: ['wineryWineList', 'list', filters],
    queryFn: () => wineryWineListService.list_wine(id,filters),
  }),

  listWineEmptyWinery: (filters: WineListEmptyWineryFilters) => ({
    queryKey: ['wineryWineList', 'list-empty-winery', filters],
    queryFn: () => wineryWineListService.list_wine_empty_winery(filters),
  }),

  addWine: () => ({
    mutationKey: ['wineryWineList', 'addWine'],
    mutationFn: ({ wineryId, wineIds }: AddWineToWineryParams) => wineryWineListService.add_wine({ wineryId, wineIds }),
  }),

  deleteWine: () => ({
    mutationKey: ['winery', 'deleteWine'],
    mutationFn: (body: DeleteWineFromWineryParams) => wineryWineListService.delete_wine(body),
  }),
}
