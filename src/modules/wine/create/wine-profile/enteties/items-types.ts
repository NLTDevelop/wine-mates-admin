export interface IItem {
  id: number
  colorHex: string
  name: string
}

export interface Subgroup {
  id: number
  colorHex: string
  name: string
  itemName?: string
  selectedItems?: number[]
  [key: string]: any
}

export interface Group {
  id: number
  colorHex: string
  name: string
  subgroups?: Subgroup[]
}

export interface MultiSelectOption {
  value: string
  label: string
  style: {
    badgeColor: string
    iconColor: string
  }
}
