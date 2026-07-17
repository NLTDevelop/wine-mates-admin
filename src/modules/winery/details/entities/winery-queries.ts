import { AddWineToWineryParams, ConfirmWineryParams, ListWineFilters } from './types'
import { wineryService } from './winery-service'

export const wineryQueries = {
  detail: (wineryId: string) => ({
    queryKey: ['winery', 'detail', wineryId],
    queryFn: () => wineryService.detail(wineryId),
    enabled: !!wineryId,
  }),

  confirm: () => ({
    mutationKey: ['winery', 'confirmWinery'],
    mutationFn: ({ id, body }: ConfirmWineryParams) => wineryService.confirm({ id, body }),
  }),

  listWine: (filters : ListWineFilters) => ({
    queryKey: ['winery', 'listWine', filters],
    queryFn: () => wineryService.list_wine( filters),
    enabled: !!filters,
  }),

  addWine: () => ({
    mutationKey: ['winery', 'addWine'],
    mutationFn: (body : AddWineToWineryParams) => wineryService.add_wine( body),
  }),

  deleteWine: () => ({
    mutationKey: ['winery', 'deleteWine'],
    mutationFn: (body : AddWineToWineryParams) => wineryService.delete_wine(body),
  }),
}
