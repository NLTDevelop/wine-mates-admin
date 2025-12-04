import { UpdateWineListParams, WineFilters, CreateWineRequest } from './types/types'
import { wineListService } from './wine-list-service'

export const wineQueries = {
  list: (filters: WineFilters) => ({
    queryKey: ['wines', 'list', filters],
    queryFn: () => wineListService.list(filters),
  }),

  detail: (id: string) => ({
    queryKey: ['wines', 'detail', id],
    queryFn: () => wineListService.detail(id),
  }),

  confirmWine: () => ({
    mutationKey: ['wines', 'confirmWine'],
    mutationFn: ({ id, isConfirmed }: { id: string; isConfirmed: boolean }) => wineListService.confirm({ id, isConfirmed }),
  }),

  create: () => ({
    mutationKey: ['wines', 'create'],
    mutationFn: (wineData: CreateWineRequest) => wineListService.create(wineData),
  }),

  update: () => ({
    mutationKey: ['wines', 'update'],
    mutationFn: ({ id, data }: UpdateWineListParams) => wineListService.update({ id, data }),
  }),

  delete: () => ({
    mutationKey: ['wines', 'delete'],
    mutationFn: (id: string) => wineListService.delete(id),
  }),

  import: () => ({
    mutationKey: ['wines', 'import'],
    mutationFn: (file: File) => wineListService.import(file),
  }),
}
