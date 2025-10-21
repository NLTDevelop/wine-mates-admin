import { api } from '@/services'
import { ConfirmUserCategoryParams, UserFilters } from './IUser'
import { buildUrl } from '@/lib/utils'
import { USER_ENDPOINTS } from './user-endpoints'

export const userService = {
  get: (id: string | number) => api.get(buildUrl(USER_ENDPOINTS.DETAIL, { id })),

  list: (filters: UserFilters) =>
    api.get(USER_ENDPOINTS.LIST, { params: filters }).then(response => response.data),

  confirmCategory: ({ id, isConfirm }: ConfirmUserCategoryParams) =>
    api.patch(buildUrl(USER_ENDPOINTS.CONFIRM_CATEGORY, { id }), { isConfirm }),
}
