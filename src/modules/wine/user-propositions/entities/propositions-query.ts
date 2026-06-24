import { propositionsService } from './propositions-service'
import { PropositionsFilters } from './types/types'

export const propositionsQueries = {
  aromaList: (filters: PropositionsFilters) => ({
    queryKey: ['aroma-propositions', 'list', filters],
    queryFn: () => propositionsService.aromaList(filters),
    keepPreviousData: true,
  }),
  flavorList: (filters: PropositionsFilters) => ({
    queryKey: ['flavor-propositions', 'list', filters],
    queryFn: () => propositionsService.flavorList(filters),
    keepPreviousData: true,
  }),
}
