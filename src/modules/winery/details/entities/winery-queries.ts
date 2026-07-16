import { AddWineToWineryParams, ConfirmWineryParams } from './types'
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

  addWine: () => ({
    mutationKey: ['winery', 'addWine'],
    mutationFn: ({ id, body }: AddWineToWineryParams) => wineryService.add_wine({ id, body }),
  }),

  deleteWine: () => ({
    mutationKey: ['winery', 'deleteWine'],
    mutationFn: ({ id }: { id: string }) => wineryService.delete_wine({ id }),
  }),
}
