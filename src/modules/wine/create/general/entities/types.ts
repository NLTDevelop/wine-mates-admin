export interface BaseWineColor {
  id: string
  // nameUa: string
  // nameEn: string
  colorHex: string
  translations: NameDictionary[]
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


export type Language = "en" | "ua" | "fr" | "pl"|"de"|"es"|"it"

export interface NameDictionary{
   name: string, 
   language: Language
}