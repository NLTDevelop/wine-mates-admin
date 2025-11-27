import { ReorderParams } from './types'
import { reorderService } from './reorder-service'

export const reorderQueries = {
  reorder: () => ({
    mutationKey: ['reorder-list'],
    mutationFn: (params: ReorderParams) => reorderService.reorder(params),
  }),
}
