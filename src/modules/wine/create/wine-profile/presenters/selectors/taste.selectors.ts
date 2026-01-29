import { TasteGroup } from '../../enteties/types/items-types'
import { ITasteCharacteristics } from '../../enteties/types/types'

export const selectTasteGroupsManaged = (items: ITasteCharacteristics[]): TasteGroup[] =>
  items.map(item => ({
    id: item.id,
    name: item.name,
    colorHex: item.colorHex,
    subgroups: [],
  }))
