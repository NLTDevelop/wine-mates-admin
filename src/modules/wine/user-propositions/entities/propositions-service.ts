import { api } from '@/services'
import { PropositionsFilters, PropositionsResponse } from './types/types'
import { PROPOSITIONS_ENDPOINTS } from './propositions-endpoints'

export const propositionsService = {
  list: (filters: PropositionsFilters): Promise<PropositionsResponse> => api.get(PROPOSITIONS_ENDPOINTS.LIST, { params: filters }).then(response => response.data),
}
