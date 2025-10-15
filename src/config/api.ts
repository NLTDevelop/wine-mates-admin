import { getEnvVar } from './env'

export const API_CONFIG = {
  baseURL: getEnvVar('API_URL', 'http://localhost:3001'),
  timeout: 10000,
  endpoints: {
    auth: '/api/admin/auth',
    users: '/api/admin/users',
    budgets: '/api/budget',
    expenses: '/api/expense',
  },
} as const
