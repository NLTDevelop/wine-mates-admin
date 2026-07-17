import { UserRequestFilters } from './types'
import { userRequestListService } from './user-requests-service'

export const userRequestsQueries = {
  list: (filters: UserRequestFilters | null) => ({
    queryKey: ['user-requests', 'list', filters],
    queryFn: () => userRequestListService.list(filters),
  }),

  delete: () => ({
    mutationKey: ['user-requests', 'delete'],
    mutationFn: (id: string) => userRequestListService.delete(id),
  }),
}
