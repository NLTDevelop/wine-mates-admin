import { wineOptionsService } from './wine-options-service'

export const wineOptionsQueries = {
  colors: (search?: string) => ({
    queryKey: ['wine-colors', search],
    queryFn: () => wineOptionsService.getColors(search),
  }),
  types: (search?: string) => ({
    queryKey: ['types', search],
    queryFn: () => wineOptionsService.getTypes(search),
  }),
}
