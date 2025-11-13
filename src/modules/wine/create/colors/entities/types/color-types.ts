export interface WineColorGroup {
  id: string
  nameUa: string
  nameEn: string
  colorHex: string
  shades: WineShades[]
}
export interface WineShades {
  id: string
  nameUa: string
  nameEn: string
  tonePale: string
  toneMedium: string
  toneDeep: string
  colorHex: string
  sortNumber: number
}

export interface CreateWineColorParams {
  nameUa: string
  nameEn: string
  colorHex: string
  shades?: WineShades[]
}

export interface UpdateWineColorParams {
  colorId: string
  newColor: CreateWineColorParams
}

export interface CreateShadesParams {
  nameUa: string
  nameEn: string
  tonePale: string
  toneMedium: string
  toneDeep: string
  colorHex: string
  sortNumber: number
}

export interface UpdateShadesParams {
  shadeId: string
  newShades: CreateShadesParams
}
