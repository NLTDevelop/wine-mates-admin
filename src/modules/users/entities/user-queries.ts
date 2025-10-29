import { UserFilters } from './IUser'
import { userService } from './user-service'

export const userQueries = {
  list: (filters: UserFilters) => ({
    queryKey: ['users', 'list', filters],
    queryFn: () => userService.list(filters),
  }),

  detail: (id: string) => ({
    queryKey: ['users', 'detail', id],
    queryFn: () => userService.detail(id),
  }),

  confirmCategory: () => ({
    mutationKey: ['users', 'confirmCategory'],
    mutationFn: ({ id, isConfirmed }: { id: string; isConfirmed: boolean }) => userService.confirmCategory({ id, isConfirmed }),
  }),
}
