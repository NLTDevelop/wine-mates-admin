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

export type Language = 'en' | 'uk' | 'fr' | 'pl' | 'de' | 'es' | 'it'

export interface NameDictionary {
  id?: string
  name: string
  language: Language
  [key: string]: string | undefined
}

export type ReorderEntityType = 'color' | 'flavors' | 'tastes' | 'taste-characteristics' | 'wine-types'

export interface ReorderParams {
  entityType: ReorderEntityType
  items: Array<{
    id: string
    order: number
  }>
}

export interface ReorderItem {
  id: number
  sortNumber: number
}

export type ReorderGroupsRequest = ReorderItem[]

export type NameDescriptionDictionary =
  | {
      id?: string
      name: string
      language: Language
    }
  | {
      id?: string
      description: string
      language: Language
    }
