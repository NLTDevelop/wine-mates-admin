import { WineryFilters } from './types'
import { wineriesListService } from './wineries-list-service'

export const wineriesQueries = {
  list: (filters: WineryFilters) => ({
    queryKey: ['wineries', 'list', filters],
    queryFn: () => wineriesListService.list(filters),
  }),
}
