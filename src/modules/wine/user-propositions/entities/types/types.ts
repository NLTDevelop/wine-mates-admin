export interface PropositionsResponse {
  rows: IPropositions[]
  totalPages: number
  count: number
}

export interface PropositionsFilters {
  limit: number
  page: number
  search?: string
  type: PropositionsType
}

export type PropositionsType = 'taste' | 'aroma'

interface BaseProposition {
  id: number
  created_at: string
}

export interface AromaProposition extends BaseProposition {
  type: 'aroma'
  aroma: string
  taste?: never
}

export interface TasteProposition extends BaseProposition {
  type: 'taste'
  taste: string
  aroma?: never
}

export type IPropositions = AromaProposition | TasteProposition
