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
        if (typeof value === 'object') {
          const stringValue = JSON.stringify(value)
          formData.append(key, stringValue)
        } else {
          formData.append(key, value.toString())
        }
      }
    })

    if (image && image instanceof File) {
      formData.append('image', image)
    }

    return api.post(WINE_PROFILE_ENDPOINTS.CREATE, formData).then(response => response.data)
  },

  update: (params: UpdateWineProfileParams): Promise<void> => {
    const formData = new FormData()

    if (params.newProfile) {
      const { image, ...restData } = params.newProfile

      Object.entries(restData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (typeof value === 'object') {
            const stringValue = JSON.stringify(value)
            formData.append(key, stringValue)
          } else {
            formData.append(key, value)
          }
        }
      })

      if (image && image instanceof File) {
        formData.append('image', image)
      }
    }

    return api
      .patch(buildUrl(WINE_PROFILE_ENDPOINTS.UPDATE, { id: params.profileId }), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => response.data)
  },

  delete: (id: string): Promise<void> => api.delete(buildUrl(WINE_PROFILE_ENDPOINTS.DELETE, { id })).then(response => response.data),
}
