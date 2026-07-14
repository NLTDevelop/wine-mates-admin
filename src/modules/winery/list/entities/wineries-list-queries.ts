import { WineriesType, WineryFilters } from "./types";
import { wineriesListService } from "./wineries-list-service";


export const wineriesQueries = {
  list: (filters: WineryFilters) => ({
    queryKey: ['wineries', 'list', filters],
    queryFn: () => wineriesListService.list(filters),
  }),

  detail: (wineId: string) => ({
    queryKey: ['wineries', 'detail', wineId],
    queryFn: () => wineriesListService.detail(wineId),
    enabled: !!wineId,
  }),

  confirm: () => ({
    mutationKey: ['wineries', 'confirmWinery'],
    mutationFn: ({ id, status }: { id: string; status: WineriesType }) => wineriesListService.confirm({ id, status }),
  }),

}
