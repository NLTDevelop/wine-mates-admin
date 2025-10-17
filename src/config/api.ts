import { getEnvVar } from './env'

export const API_CONFIG = {
  baseURL: getEnvVar('API_URL'),
  timeout: 10000,
  endpoints: {
    auth: '/v1/admin/auth/sign-in',
    users: '',
  },
} as const
