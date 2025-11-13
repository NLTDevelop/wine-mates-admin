import { BASE_ADMIN_PATH } from '@/constatnts/base-admin-path'

export const WINE_LIST_ENDPOINTS = {
  LIST: BASE_ADMIN_PATH + '/wines',
  DETAIL: BASE_ADMIN_PATH + '/wine/{id}',
  UPDATE: BASE_ADMIN_PATH + '/wines/{id}/update',
  DELETE: BASE_ADMIN_PATH + '/wines/{id}/delete',
  CONFIRM: BASE_ADMIN_PATH + '/wines/{id}/confirmation',
  IMPORT: BASE_ADMIN_PATH + '/wines/import',
} as const
