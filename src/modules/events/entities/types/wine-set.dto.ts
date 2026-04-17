export interface IWineSetResponse {
  id: number
  sortOrder: number
  wine: Wine
}
export interface IWineSet {
  wineId: number
  sortOrder: number
}

export interface IWine {
  id: number
  name: string
  producer: string
  vintage: number
  image: IWineImg
  vintages: IWineVintages[]
}

interface WineImage {
  smallUrl: string
  mediumUrl: string
  originalUrl: string
}

interface Wine {
  id: number
  name: string
  producer: string
  vintage: number | null
  image: WineImage | null
}

interface IWineImg {
  smallUrl: string
  mediumUrl: string
}

interface IWineVintages {
  wineId: number
  vintage: number
}
