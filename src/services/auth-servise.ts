import { API_CONFIG } from '@/config'
import { api } from './base-service'

export interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    name: string
    role: 'admin'
  }
}

export const authService = {
  login: (credentials: LoginData): Promise<AuthResponse> =>
    api.post(API_CONFIG.endpoints.auth, credentials).then(res => res.data),

  logout: (): void => {
    localStorage.removeItem('admin-token')
    localStorage.removeItem('admin-user')
  },

  validateToken: (): Promise<{ valid: boolean }> =>
    api.get('/api/admin/validate-token').then(res => res.data),
}
