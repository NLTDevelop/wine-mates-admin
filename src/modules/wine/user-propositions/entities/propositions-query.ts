import { propositionsService } from './propositions-service'
import { PropositionsFilters } from './types/types'

export const propositionsQueries = {
  list: (filters: PropositionsFilters) => ({
    queryKey: ['propositions', 'list', filters],
    queryFn: () => propositionsService.list(filters),
    keepPreviousData: true,
  }),
}
