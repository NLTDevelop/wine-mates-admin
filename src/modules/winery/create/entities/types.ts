export interface RegisterWineryUserDto {
  email: string
  password: string
  phoneNumber: string
  country: string
  birthday: string
}

export interface RegisterWineryDataDto {
  name: string
  foundedYear: number
  description: string
  countryId: number
  regionId?: number
  countryIds: number[]
  links?: string[]
}

export interface RegisterWineryDto {
  user: RegisterWineryUserDto
  winery: RegisterWineryDataDto
}
