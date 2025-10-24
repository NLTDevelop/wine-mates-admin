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

enum WineColor {
  Red = 'red',
  White = 'white',
  Rose = 'rose',
  Sparkling = 'sparkling',
  Dessert = 'dessert',
  Orange = 'orange',
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
}

export interface WineTemplate {
  type: 'color_palette' | 'flavor_palette' | 'smell_palette' | 'food_categories' | 'wine_creation'
  name: string
  description: string
  icon?: React.ReactElement | string
}

export type CreateWineRequest = Omit<IWine, 'id'>
export type UpdateWineRequest = Partial<Omit<IWine, 'id'>>
