import { BASE_ADMIN_PATH } from '@/constatnts/base-admin-path'

export const USER_ENDPOINTS = {
  LIST: BASE_ADMIN_PATH + '/users',
  DETAIL: BASE_ADMIN_PATH + '/users/{id}',
  CONFIRM_CATEGORY: BASE_ADMIN_PATH + '/users/{id}/confirmation',
} as const
