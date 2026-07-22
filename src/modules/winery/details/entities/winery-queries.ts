import { ConfirmWineryParams, UpdateWineryParams } from './types'
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

  update: () => ({
    mutationKey: ['winery', 'update'],
    mutationFn: (params: UpdateWineryParams) => wineryService.update(params),
  }),
}
