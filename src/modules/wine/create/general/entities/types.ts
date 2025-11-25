export interface BaseWineColor {
  id: string
  colorHex: string
  translations?: NameDictionary[]
  name?: string
}

export interface DataResponse<T> {
  count: number
  rows: T[]
}

export interface FiltersParams {
  search?: string
  limit?: number
  page?: number
  include?: string[]
}


export type Language = "en" | "uk" | "fr" | "pl"|"de"|"es"|"it"

export interface NameDictionary{
   name: string, 
   language: Language
}

export type ReorderEntityType = 'color' | 'flavors' | 'tastes' | 'taste-characteristics' | 'wine-types'

export interface ReorderParams {
  entityType: ReorderEntityType
  items: Array<{
    id: string
    order: number
  }>
}