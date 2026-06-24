import { api } from '@/services'
import { ConfirmUserCategoryParams, IUserDetail, UserFilters } from './IUser'
import { buildUrl } from '@/lib/utils'
import { USER_ENDPOINTS } from './user-endpoints'

export const userService = {
  detail: (id: string | number): Promise<{ data: IUserDetail }> => api.get(buildUrl(USER_ENDPOINTS.DETAIL, { id })),

  list: (filters: UserFilters) => api.get(USER_ENDPOINTS.LIST, { params: filters }).then(response => response.data),

  confirmCategory: ({ id, isConfirmed }: ConfirmUserCategoryParams) => api.patch(buildUrl(USER_ENDPOINTS.CONFIRM_CATEGORY, { id }), { isConfirmed }),
}
