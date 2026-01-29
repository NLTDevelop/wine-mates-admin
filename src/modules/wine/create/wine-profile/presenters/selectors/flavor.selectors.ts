import { FlavorGroup } from '../../enteties/types/items-types'
import { IFlavorGroup } from '../../enteties/types/types'

export const selectFlavorGroupsManaged = (groups: IFlavorGroup[]): FlavorGroup[] =>
  groups.map(group => ({
    id: group.id,
    name: group.name,
    colorHex: group.colorHex,
    subgroups: [
      {
        id: group.id,
        name: group.name,
        colorHex: group.colorHex,
        items: group.flavors,
        selectedItems: group.flavors.map(f => f.id),
      },
    ],
  }))
