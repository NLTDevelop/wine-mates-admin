import { IOption, IOptionWithColor } from './types'

export interface IItem {
  id: number
  name: string
  colorHex?: string
}

export interface Subgroup<TItem extends IItem> {
  id: number
  name: string
  colorHex: string
  items: TItem[]
  selectedItems: number[]
}

export interface Group<TSubgroup> {
  id: number
  name: string
  colorHex: string
  subgroups: TSubgroup[]
}
export interface AromaSubgroupRaw {
  id: number
  name: string
  colorHex: string
  aromas: IOption[]
}

export type AromaSubgroup = Subgroup<IOption>
export type AromaGroup = Group<AromaSubgroup>

export interface AromaGroupRaw {
  id: number
  name: string
  colorHex: string
  subgroups: AromaSubgroupRaw[]
}

export interface FlavorGroupRaw {
  id: number
  name: string
  colorHex: string
  flavors: IOptionWithColor[]
}

export type FlavorSubgroup = Subgroup<IOptionWithColor>
export type FlavorGroup = Group<FlavorSubgroup>

export interface TasteLevelItem extends IItem {
  level: number
}

export type TasteSubgroup = Subgroup<TasteLevelItem>
export type TasteGroup = Group<TasteSubgroup>

export interface MultiSelectOption {
  value: string
  label: string
  style: {
    badgeColor: string
    iconColor: string
  }
}
