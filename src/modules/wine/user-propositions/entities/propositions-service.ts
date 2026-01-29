import { api } from '@/services'
import { PropositionsFilters, PropositionsResponse } from './types/types'
import { PROPOSITIONS_ENDPOINTS } from './propositions-endpoints'

export const propositionsService = {
  aromaList: (filters: PropositionsFilters): Promise<PropositionsResponse> => api.get(PROPOSITIONS_ENDPOINTS.AROMA_LIST, { params: filters }).then(response => response.data),

  flavorList: (filters: PropositionsFilters): Promise<PropositionsResponse> => api.get(PROPOSITIONS_ENDPOINTS.FLAVOR_LIST, { params: filters }).then(response => response.data),
}
