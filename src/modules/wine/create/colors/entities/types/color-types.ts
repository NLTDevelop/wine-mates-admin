import { NameDictionary } from "../../../general/entities/types"

export interface WineColorGroup {
  id: string
  translations: NameDictionary[]
  nameUa?: string
  nameEn?: string
  colorHex: string
  shades: WineShades[]
}
export interface WineShades {
  id: string
  translations: NameDictionary[]
  tonePale: string
  toneMedium: string
  toneDeep: string
  colorHex: string
  sortNumber: number
}

export interface CreateWineColorParams {
  translations: NameDictionary[]
  colorHex: string
  shades?: WineShades[]
}

export interface UpdateWineColorParams {
  colorId: string
  newColor: CreateWineColorParams
}

export interface CreateShadesParams {
  translations: NameDictionary[]
  tonePale: string
  toneMedium: string
  toneDeep: string
  colorHex?: string
  sortNumber?: number
}

export interface UpdateShadesParams {
  shadeId: string
  newShades: CreateShadesParams
}

export interface ReorderShadesParams {
  colorId: string;
  shadeIds: string[];
}