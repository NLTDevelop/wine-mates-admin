export interface Country {
  id: number
  name: string
  code?: string
}

export interface Region {
  id: number
  name: string
  countryId: number
}
