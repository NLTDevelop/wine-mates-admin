import { buildUrl } from '@/lib/utils'
import { api } from '@/services'
import { CreatePartnerWineOfferPayload, PartnerWineOffersFilters, PartnerWineOffersResponse, UpdatePartnerWineOfferParams } from './partner-wine-offer-types'
import { PARTNER_WINE_OFFER_ENDPOINTS } from './partner-wine-offer-endpoints'

export const partnerWineOfferService = {
  list: (filters: PartnerWineOffersFilters): Promise<PartnerWineOffersResponse> => api.get(PARTNER_WINE_OFFER_ENDPOINTS.LIST, { params: filters }).then(response => response.data),

  create: (data: CreatePartnerWineOfferPayload) => api.post(PARTNER_WINE_OFFER_ENDPOINTS.CREATE, data).then(response => response.data),

  update: ({ id, data }: UpdatePartnerWineOfferParams) => api.patch(buildUrl(PARTNER_WINE_OFFER_ENDPOINTS.UPDATE, { id }), data).then(response => response.data),

  delete: (id: number) => api.delete(buildUrl(PARTNER_WINE_OFFER_ENDPOINTS.DELETE, { id })).then(response => response.data),
}
