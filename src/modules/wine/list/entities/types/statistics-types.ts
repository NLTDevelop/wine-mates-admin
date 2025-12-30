export type ColorShade = {
  id: number
  colorHex: string
  name: string
  userCount: number
  tone: string
}

export type TopColor = {
  id: number
  colorHex: string
  name: string
  userCount: number
  shades: ColorShade[]
}

export type AromaLeaf = {
  id: number
  name: string
  userCount: number
}

export type AromaSubgroup = {
  id: number
  colorHex: string
  name: string
  userCount: number
  aromas: AromaLeaf[]
}

export type TopAroma = {
  id: number
  colorHex: string
  name: string
  userCount: number
  subgroups: AromaSubgroup[]
}

export type TopFlavor = {
  id: number
  colorHex: string
  name: string
  userCount: number
}

export type TasteLevel = {
  id: number
  name: string
  userCount: number
}

export type TasteCharacteristic = {
  id: number
  colorHex: string
  name: string
  userCount: number
  levels: TasteLevel[]
}
