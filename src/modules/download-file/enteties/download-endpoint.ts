import { BASE_ADMIN_PATH } from '@/constatnts/base-admin-path'

export const DOWNLOAD_ENDPOINTS = {
  DOWNLOAD_FILE: BASE_ADMIN_PATH + '/files/{media}',
} as const
