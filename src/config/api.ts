import { getEnvVar } from './env'

export const API_CONFIG = {
  baseURL: getEnvVar('API_URL'),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
} as const
