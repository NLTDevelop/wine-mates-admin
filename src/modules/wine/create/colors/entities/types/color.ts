export interface WineColorTones {
  pale: string
  medium: string
  deep: string
}

export interface WineColorItem {
  name: string
  nameEn: string
  tones: WineColorTones
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
