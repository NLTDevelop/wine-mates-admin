import { CreatePartnerWineOfferPayload, PartnerWineOffersFilters, UpdatePartnerWineOfferParams } from './partner-wine-offer-types'
import { partnerWineOfferService } from './partner-wine-offer-service'

export const partnerWineOfferQueries = {
  list: (filters: PartnerWineOffersFilters) => ({
    queryKey: ['partners', 'wine-offers', filters],
    queryFn: () => partnerWineOfferService.list(filters),
  }),

  create: () => ({
    mutationKey: ['partners', 'wine-offers', 'create'],
    mutationFn: (data: CreatePartnerWineOfferPayload) => partnerWineOfferService.create(data),
  }),

  update: () => ({
    mutationKey: ['partners', 'wine-offers', 'update'],
    mutationFn: (params: UpdatePartnerWineOfferParams) => partnerWineOfferService.update(params),
  }),

  delete: () => ({
    mutationKey: ['partners', 'wine-offers', 'delete'],
    mutationFn: (id: number) => partnerWineOfferService.delete(id),
  }),
}
