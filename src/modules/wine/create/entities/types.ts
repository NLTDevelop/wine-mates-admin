interface IWine {
  id: string
  basicInfo: IWineBasicInfo
  color: WineColor
  tasteTags: IWineTasteTags
  characteristics: IWineCharacteristics
  aging?: IWineAging
  foodPairing: IWineFoodPairing
  winery: string
  grade?: string
  customName?: string
}

interface IWineBasicInfo {
  name: string
  fullDescription: string
  region: string
  country: string
  vintage: number
  imageUrl: string
}

export interface WineColorTones {
  pale: string
  medium: string
  deep: string
}

export interface WineColorFormData {
  category: string
  colorName: string
  tones: WineColorTones
}

export interface WineColorItem {
  name: string
  tones: WineColorTones
}

export interface WineColor {
  value: string
  label: string
  labelEn?: string
  items?: WineColorItem[]
  tones?: {
    pale: string
    medium: string
    deep: string
  }
}

export interface WineCategoryFormData {
  value: string
  label: string
  labelEn: string
  tones?: {
    pale: string
    medium: string
    deep: string
  }
}

export interface ColorInput {
  name: string
  pale: string
  medium: string
  deep: string
}

interface IWineTasteTags {
  descriptors: string[]
}

interface IWineCharacteristics {
  sweetness: number
  acidity: number
  tanninLevel: number
  tanninIntensity: number
  alcohol: number
  body: number
  finish: number
}

interface IWineAging {
  peakStart: number
  peakEnd: number
}

interface IWineFoodPairing {
  categories: FoodCategory[]
}

enum FoodCategory {
  Seafood = 'Seafood',
  Fish = 'Fish',
  WhiteMeat = 'White Meat',
  RedMeat = 'Red Meat',
  Cheese = 'Cheese',
  Desserts = 'Desserts',
  Vegetarian = 'Vegetarian',
}

export type CreateWineFormData = {
  basicInfo: {
    name: string
    fullDescription: string
    region: string
    country: string
    vintage: number
    imageUrl: string
    subtitle?: string
  }
  color: string
  colorVariety: string
  tasteTags: {
    descriptors: string[]
  }
  smellTags: {
    descriptors: string[]
  }
  flavorVariety: string
  smellVariety: string
  characteristics: {
    sweetness: number
    acidity: number
    tanninLevel: number
    tanninIntensity: number
    alcohol: number
    body: number
    finish: number
  }
  aging?: {
    peakStart: number
    peakEnd: number
  }
  foodPairing: {
    categories: FoodCategory[]
  }
  winery: string
  grade?: string
  customName?: string
}

export interface WineOption {
  value: string
  label: string
  items?: string[]
  colorLabel?: string
  tones?: {
    pale?: string
    medium?: string
    deep?: string
  }
}

export interface WineTemplate {
  type: 'color_palette' | 'flavor_palette' | 'smell_palette' | 'wine_type' | 'wine_creation'
  name: string
  description: string
  icon?: React.ReactElement | string
}

export type CreateWineRequest = Omit<IWine, 'id'>
export type UpdateWineRequest = Partial<Omit<IWine, 'id'>>
