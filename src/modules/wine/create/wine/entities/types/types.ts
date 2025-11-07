export interface WineFormData {
  displayName: string
  producerTitle: string
  producerName: string
  wine: string
  grapeVariety: string
  country: string[]
  region?: string[]
  subRegion?: string[]
  site?: string

  type: string // ID выбранного WineType
  subType?: string
  designation?: string
  classification?: string

  vintageConfig?: number
  firstVintage?: number
  finalVintage?: number

  reference?: string
  description?: string
  images: File[]
}

export type CountryOption = {
  value: string
  label: string
  regions: RegionOption[]
}

export type RegionOption = {
  value: string
  label: string
  subRegions: SubRegionOption[]
}

export type SubRegionOption = {
  value: string
  label: string
}
