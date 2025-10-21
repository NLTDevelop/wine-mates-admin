import { AuthResponse, LoginData } from '@/modules/autorization/entities/types'
import { ADMIN_TOKEN, ADMIN_USER } from '@/constatnts/locale-storage'
import { api } from '@/services'
import { AUTH_ENDPOINTS } from './auth-endpoints'

export const authService = {
  login: (credentials: LoginData): Promise<AuthResponse> => {
    return api.post(AUTH_ENDPOINTS.AUTH, credentials).then(res => {
      if (res.data.accessToken && !res.data.user) {
        const userData = {
          id: 'temp-id',
          email: credentials.email,
          name: credentials.email.split('@')[0],
          role: 'admin' as const,
        }
        return {
          accessToken: res.data.accessToken,
          user: userData,
        }
      }

      return res.data
    })
  },

  logout: (): void => {
    localStorage.removeItem(ADMIN_TOKEN)
    localStorage.removeItem(ADMIN_USER)
  },
}
