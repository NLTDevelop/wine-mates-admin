import { UpdateRequestParams } from './types'
import { userRequestDetailService } from './user-request-service'

export const userRequestQueries = {
  detail: (requestId: string) => ({
    queryKey: ['user_request', 'detail', requestId],
    queryFn: () => userRequestDetailService.detail(requestId),
    enabled: !!requestId,
  }),

  update: () => ({
    mutationKey: ['wines', 'update'],
    mutationFn: ({ id, body }: UpdateRequestParams) => userRequestDetailService.update({ id, body }),
  }),
}
