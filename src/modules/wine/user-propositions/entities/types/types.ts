export interface PropositionsResponse {
  rows: BaseProposition[]
  totalPages: number
  count: number
}

export interface PropositionsFilters {
  limit: number
  page: number
  search?: string
}

export type PropositionsType = 'taste' | 'aroma'

export interface BaseProposition {
  id: number
  name: string
  createdAt: string
}

export interface AromaProposition extends BaseProposition {
  type: 'aroma'
}

export interface TasteProposition extends BaseProposition {
  type: 'taste'
}

export type Proposition = AromaProposition | TasteProposition
