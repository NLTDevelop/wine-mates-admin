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

  updateCategory: () => ({
    mutationKey: ['users', 'updateCategory'],
    mutationFn: ({ id, category, note }: { id: string; category: string; note?: string }) =>
      userService.updateCategory({ id, category, note }),
  }),
}
