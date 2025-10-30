import { wineOptionsService } from './wine-options-service'

export const wineOptionsQueries = {
  colors: (search?: string) => ({
    queryKey: ['wine-colors', search],
    queryFn: () => wineOptionsService.getColors(search),
  }),

  aromas: (search?: string) => ({
    queryKey: ['wine-aromas', search],
    queryFn: () => wineOptionsService.getAromas(search),
  }),

  flavorNotes: (search?: string) => ({
    queryKey: ['wine-flavor-notes', search],
    queryFn: () => wineOptionsService.getFlavorNotes(search),
  }),

  flavorCharacteristics: (search?: string) => ({
    queryKey: ['wine-flavor-characteristics', search],
    queryFn: () => wineOptionsService.getFlavorCharacteristics(search),
  }),
}
