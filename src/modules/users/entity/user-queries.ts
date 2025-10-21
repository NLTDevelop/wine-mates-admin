import { userService } from '@/modules/users/entity/user-service'
import { UserFilters } from './IUser'

export const userQueries = {
  list: (filters: UserFilters) => ({
    queryKey: ['users', 'list', filters],
    queryFn: () => userService.list(filters),
  }),

  detail: (id: string) => ({
    queryKey: ['users', 'detail', id],
    queryFn: () => userService.get(id),
  }),

  confirmCategory: () => ({
    mutationKey: ['users', 'confirmCategory'],
    mutationFn: ({ id, isConfirm }: { id: string; isConfirm: boolean }) =>
      userService.confirmCategory({ id, isConfirm }),
  }),
}
