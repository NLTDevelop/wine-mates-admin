import { useState } from 'react'
import { useGroupManagement } from './useGroupManagement'
import { Group } from '../enteties/items-types'

export interface WineProfileFormData {
  wineTypeId: string
  colorId: string
  aromaGroupIds: string[]
  aromaSubgroupIds: string[]
  aromaIds: string[]

  flavorGroupIds: string[]
  flavorIds: string[]
  characteristicGroupIds: string[]
  characteristicIds: string[]
}

export const useCreateWineProfile = (aromasData: Group[]) => {
  const [wineTypeId, setWineTypeId] = useState('')
  const [colorId, setColorId] = useState('')

  const aromas = useGroupManagement({ initialGroups: aromasData, itemName: 'aromas' })

  // TODO: Добавить для вкусов и характеристик
  const [flavorGroupIds, _setFlavorGroupIds] = useState<string[]>([])
  const [flavorIds, _setFlavorIds] = useState<string[]>([])
  const [characteristicGroupIds, _setCharacteristicGroupIds] = useState<string[]>([])
  const [characteristicIds, _setCharacteristicIds] = useState<string[]>([])

  const getFormData = (): WineProfileFormData => {
    const aromasData = aromas.getSelectedGroupData()

    return {
      wineTypeId,
      colorId,
      aromaGroupIds: aromasData.groupIds,
      aromaSubgroupIds: aromasData.subgroupIds,
      aromaIds: aromasData.itemIds,
      flavorGroupIds,
      flavorIds,
      characteristicGroupIds,
      characteristicIds,
    }
  }

  const canSaveProfile = () => {
    return wineTypeId !== '' && colorId !== ''
  }

  const resetForm = () => {
    setWineTypeId('')
    setColorId('')
    // TODO: для ароматов, вкусов, характеристик
  }

  return {
    wineTypeId,
    setWineTypeId,
    colorId,
    setColorId,

    ...aromas,

    // TODO: Добавить вкусы и характеристики

    getFormData,
    canSaveProfile,
    resetForm,
  }
}
