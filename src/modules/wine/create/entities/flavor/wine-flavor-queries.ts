import { wineFlavorService } from './wine-flavor-service';
import { WineOption } from '../types';

export const wineFlavorQueries = {
  list: () => ({
    queryKey: ['wine-flavors', 'list'],
    queryFn: () => wineFlavorService.list(),
  }),

  create: () => ({
    mutationKey: ['wine-flavors', 'create'],
    mutationFn: (flavor: WineOption) => wineFlavorService.create(flavor),
  }),

  update: () => ({
    mutationKey: ['wine-flavors', 'update'],
    mutationFn: (params: { oldValue: string; newFlavor: WineOption }) => 
      wineFlavorService.update(params),
  }),

  delete: () => ({
    mutationKey: ['wine-flavors', 'delete'],
    mutationFn: (flavorValue: string) => wineFlavorService.delete(flavorValue),
  }),
};