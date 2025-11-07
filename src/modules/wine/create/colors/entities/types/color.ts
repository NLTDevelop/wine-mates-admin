export interface WineColorTones {
  pale: string
  medium: string
  deep: string
}

export interface WineColorItem {
  id: string
  name: string
  nameEn: string
  tones: WineColorTones
  shade: string
  order: string
}

export interface WineColor {
  id: string
  label: string
  labelEn: string
  value: string
  items?: WineColorItem[]
}

export interface CreateWineColorParams {
  label: string
  labelEn: string
  value: string
  items?: WineColorItem[]
}

export interface UpdateWineColorParams {
  colorId: string
  newColor: CreateWineColorParams
}

export interface CreateWineItemParams {
  name: string
  nameEn: string
  shade: string
  tones: WineColorTones
  order: string
}

export interface CreateShadeParams {
  colorId: string
  item: CreateWineItemParams
}
export interface UpdateWineItemParams {
  itemId: string
  name: string
  nameEn: string
  shade: string
  tones: WineColorTones
  order: string
}

export interface UpdateShadeParams {
  colorId: string
  item: UpdateWineItemParams
}

export interface ReorderShadesParams {
  colorId: string
  shades: {
    id: string
    order: number
  }[]
}
