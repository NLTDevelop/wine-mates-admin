import { api } from '@/services'
import { RegisterWineryDto } from './types'
import { WINERY_CREATE_ENDPOINTS } from './winery-create-endpoints'
import { IWineryDetail } from '../../details/entities/types'

export interface RegisterWineryResponse {
  accessToken: string
  user: unknown
  winery: IWineryDetail
}

export const wineryCreateService = {
  register: (data: RegisterWineryDto): Promise<RegisterWineryResponse> => api.post(WINERY_CREATE_ENDPOINTS.REGISTER, data).then(response => response.data),
}
