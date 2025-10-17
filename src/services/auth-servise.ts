import { API_CONFIG } from '@/config'
import { api } from './base-service'
import { AuthResponse, LoginData } from '@/entities/auth'

export const authService = {
  login: (credentials: LoginData): Promise<AuthResponse> => {
    return api.post(API_CONFIG.endpoints.auth, credentials).then(res => {
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
    localStorage.removeItem('admin-token')
    localStorage.removeItem('admin-user')
  },
}
