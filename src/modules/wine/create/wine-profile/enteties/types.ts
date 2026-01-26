export interface CreateWineProfileRequest {
  wineTypeId: string
  colorId: string
  aromaGroupIds?: string[]
  aromaSupgroupIds?: string[]
  flavorGroupIds?: string[]
  flavorIds?: string[]
}
