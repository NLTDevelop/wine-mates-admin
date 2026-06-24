import { IAromaGroup } from '../../enteties/types/types'
import { AromaGroup } from '../../enteties/types/items-types'

export const selectAromaGroupsManaged = (groups: IAromaGroup[]): AromaGroup[] =>
  groups.map(group => ({
    id: group.id,
    name: group.name,
    colorHex: group.colorHex,
    subgroups: group.subgroups.map(sub => ({
      id: sub.id,
      name: sub.name,
      colorHex: group.colorHex,
      items: sub.aromas,
      selectedItems: sub.aromas.map(a => a.id),
    })),
  }))
