export interface CreateWineProfileRequest {
  typeId: number
  colorId: number
  selectedAromas: SelectedAroma[]
  selectedFlavors: SelectedFlavor[]
  selectedTasteCharacteristics: number[]
}

export interface UpdateWineProfileParams {
  profileId: string
  newProfile?: NewWineProfile
}

export interface NewWineProfile {
  selectedAromas: SelectedAroma[]
  selectedFlavors: SelectedFlavor[]
  selectedTasteCharacteristics: number[]
}

export interface SelectedAroma {
  aromaGroupId: number
  aromaSubgroups: AromaSubgroup[]
}

export interface AromaSubgroup {
  aromaSubgroupId: number
  aromas: number[]
}
export interface SelectedFlavor {
  flavorGroupId: number
  flavors: number[]
}

export interface IOption {
  id: number
  name: string
}

export interface IOptionWithColor extends IOption {
  colorHex: string
}
export interface ISubgroup extends IOption {
  aromas: IOption[]
}
export interface ITasteCharacteristics extends IOptionWithColor {
  description: string
  qtyLevels: number
}

export interface IAromaGroup extends IOptionWithColor {
  subgroups: ISubgroup[]
}
export interface IFlavorGroup extends IOptionWithColor {
  flavors: IOptionWithColor[]
}
export interface IWineProfileFormData {
  types: IOption[]
  colors: IOptionWithColor[]
  aromaGroups: IAromaGroup[]
  flavorGroups: IFlavorGroup[]
  tasteCharacteristics: ITasteCharacteristics[]
}
export interface IWineProfile {
  id: string
  type: IOption
  color: IOptionWithColor
}
export interface IWineProfileDetail {
  id: string
  type: IOption
  color: IOptionWithColor
  selectedAromas: IAromaGroup[]
  selectedFlavors: IFlavorGroup[]
  selectedTasteCharacteristics: ITasteCharacteristics[]
}
