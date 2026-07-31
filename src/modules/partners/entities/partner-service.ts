/* global File, FormData */
import { buildUrl } from '@/lib/utils'
import { api } from '@/services'
import { PartnerFilters, PartnerFormPayload, IPartner, PartnersResponse, UpdatePartnerParams } from './types'
import { PARTNER_ENDPOINTS } from './partner-endpoints'

const buildPartnerFormData = (data: PartnerFormPayload) => {
  const formData = new FormData()

  formData.append('name', data.name.trim())

  if (data.website?.trim()) {
    formData.append('website', data.website.trim())
  }

  if (data.status) {
    formData.append('status', data.status)
  }

  data.countryIds.forEach(countryId => {
    formData.append('countryIds', String(countryId))
  })

  if (data.logo instanceof File) {
    formData.append('logo', data.logo)
  }

  if (data.image instanceof File) {
    formData.append('image', data.image)
  }

  return formData
}

export const partnerService = {
  list: (filters: PartnerFilters): Promise<PartnersResponse> => {
    const params = {
      ...filters,
      status: filters.status || undefined,
      search: filters.search || undefined,
    }

    return api.get(PARTNER_ENDPOINTS.LIST, { params }).then(response => response.data)
  },

  detail: (id: string | number): Promise<IPartner> => api.get(buildUrl(PARTNER_ENDPOINTS.DETAIL, { id })).then(response => response.data),

  create: (data: PartnerFormPayload): Promise<IPartner> => api.post(PARTNER_ENDPOINTS.CREATE, buildPartnerFormData(data)).then(response => response.data),

  update: (params: UpdatePartnerParams): Promise<IPartner> => api.patch(buildUrl(PARTNER_ENDPOINTS.UPDATE, { id: params.id }), buildPartnerFormData(params.data)).then(response => response.data),

  delete: (id: string | number) => api.delete(buildUrl(PARTNER_ENDPOINTS.DELETE, { id })),
}
