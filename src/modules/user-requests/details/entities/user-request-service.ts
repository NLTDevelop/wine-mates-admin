import { api } from '@/services'
import { buildUrl } from '@/lib/utils'
import { USER_REQUEST_ENDPOINTS } from './user-request-endpoints'
import { UpdateRequestParams} from './types'
import { IUserRequest } from '../../list/entities/types'

export const userRequestDetailService = {
  detail: (id: string | number): Promise<{ data: IUserRequest }> => api.get(buildUrl(USER_REQUEST_ENDPOINTS.DETAIL, { id })),

  update: ({ id, body }: UpdateRequestParams) => api.patch(buildUrl(USER_REQUEST_ENDPOINTS.UPDATE, { id }), body).then(response => response.data),
}
