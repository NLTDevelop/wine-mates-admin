export const WINERY_ENDPOINTS = {
  CONFIRM: '/v1/admin/winery-applications/{wineryId}',
  DETAIL: '/v1/admin/wineries/{id}',
  ADD_WINE: '/v1/admin/wineries/{id}/add_wine',
  DELETE_WINE: '/v1/admin/wineries/{id}/delete_wine/{wineId}',
} as const
