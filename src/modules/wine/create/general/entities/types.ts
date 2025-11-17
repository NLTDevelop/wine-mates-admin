export interface BaseWineColor {
  id: string
  nameUa: string
  nameEn: string
  colorHex: string
}

export interface DataResponse<T> {
  count: number
  rows: T[]
}

export interface FiltersParams {
  search?: string
  limit?: number
  offset?: number
  include?: string[]
}
