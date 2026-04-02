import { api } from '@/services'
import { buildUrl } from '@/lib/utils'
import { CreateWineProfileRequest, IWineProfileDetail, IWineProfile, UpdateWineProfileParams, IWineProfileFormData } from './types/types'
import { WINE_PROFILE_ENDPOINTS } from './profile-endpoints'

export const wineProfileService = {
  detail: (id: string | number): Promise<{ data: IWineProfileDetail }> => api.get(buildUrl(WINE_PROFILE_ENDPOINTS.DETAIL, { id })),

  list: (): Promise<IWineProfile[]> => api.get(WINE_PROFILE_ENDPOINTS.LIST).then(response => response.data),

  formData: (): Promise<IWineProfileFormData> => api.get(WINE_PROFILE_ENDPOINTS.FORMDATA).then(response => response.data),

  create: (profileData: CreateWineProfileRequest): Promise<IWineProfile[]> => {
    const formData = new FormData()
    const { image, ...restData } = profileData

    Object.entries(restData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object' && !(value instanceof File)) {
          formData.append(key, JSON.stringify(value))
        } else {
          formData.append(key, value.toString())
        }
      }
    })

    if (image && image instanceof File) {
      formData.append('image', image)
    }

    for (const pair of formData.entries()) {
  console.log(pair[0], pair[1]);
}
    return api.post(WINE_PROFILE_ENDPOINTS.CREATE, formData).then(response => response.data)
  },

  update: (params: UpdateWineProfileParams): Promise<void> => api.patch(buildUrl(WINE_PROFILE_ENDPOINTS.UPDATE, { id: params.profileId }), params.newProfile).then(response => response.data),

  delete: (id: string): Promise<void> => api.delete(buildUrl(WINE_PROFILE_ENDPOINTS.DELETE, { id })).then(response => response.data),
}
