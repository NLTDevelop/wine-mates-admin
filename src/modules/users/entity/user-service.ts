import { api } from '@/services'
import { UpdateUserCategoryParams, UserFilters } from './IUser'
import { buildUrl } from '@/lib/utils'
import { USER_ENDPOINTS } from './user-endpoints'

export const userService = {
  get: (id: string | number) => api.get(buildUrl(USER_ENDPOINTS.DETAIL, { id })),

  list: (filters: UserFilters) =>
    api.get(USER_ENDPOINTS.LIST, { params: filters }).then(response => response.data),

  updateCategory: ({ id, category, note }: UpdateUserCategoryParams) =>
    api.patch(buildUrl(USER_ENDPOINTS.UPDATE_CATEGORY, { id }), {
      category,
      note,
    }),
}
