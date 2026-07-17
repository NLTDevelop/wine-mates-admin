import { api } from '@/services'
import { buildUrl } from '@/lib/utils'
import { USER_REQUEST_ENDPOINTS } from './user-request-endpoints'
import { UpdateRequestParams, UserRequestDetailResponse } from './types'

export const userRequestDetailService = {
  detail: (id: string | number): Promise<{ data: UserRequestDetailResponse }> => api.get(buildUrl(USER_REQUEST_ENDPOINTS.DETAIL, { id })),

  update: ({ id, body }: UpdateRequestParams) => api.patch(buildUrl(USER_REQUEST_ENDPOINTS.UPDATE, { id }), body).then(response => response.data),
}
