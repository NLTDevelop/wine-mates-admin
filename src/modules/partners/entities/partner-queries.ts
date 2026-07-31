import { PartnerFilters, PartnerFormPayload, UpdatePartnerParams } from './types'
import { partnerService } from './partner-service'

export const partnerQueries = {
  list: (filters: PartnerFilters) => ({
    queryKey: ['partners', 'list', filters],
    queryFn: () => partnerService.list(filters),
  }),

  detail: (partnerId?: string) => ({
    queryKey: ['partners', 'detail', partnerId],
    queryFn: () => partnerService.detail(partnerId!),
    enabled: !!partnerId,
  }),

  create: () => ({
    mutationKey: ['partners', 'create'],
    mutationFn: (data: PartnerFormPayload) => partnerService.create(data),
  }),

  update: () => ({
    mutationKey: ['partners', 'update'],
    mutationFn: (params: UpdatePartnerParams) => partnerService.update(params),
  }),

  delete: () => ({
    mutationKey: ['partners', 'delete'],
    mutationFn: (id: number) => partnerService.delete(id),
  }),
}
