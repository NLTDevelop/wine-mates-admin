import { Group, Subgroup, IItem } from '../enteties/types/items-types'
import { ISubgroup } from '../enteties/types/types'

export const mapResultDataToGroups = <TItem extends IItem>(data: any[]): Group<Subgroup<TItem>>[] => {
  return data.map(group => ({
    id: group.groupId,
    name: group.name,
    colorHex: group.colorHex,
    subgroups: group.subgroups.map((subgroup: any) => ({
      id: subgroup.subgroupId || subgroup.id,
      name: subgroup.name,
      colorHex: subgroup.subgroupColorHex,
      items: subgroup?.items,
      selectedItems: subgroup?.items?.map((item: TItem) => item.id),
    })),
  }))
}

type GroupType = 'aroma' | 'flavor' | 'characteristic'

export const mapProfileToGroups = (sourceGroups: any[], selectedData: any[], type: GroupType) => {
  if (!selectedData || selectedData.length === 0) {
    return sourceGroups
  }

  switch (type) {
    case 'aroma':
      return sourceGroups.map(group => {
        const selectedGroup = selectedData.find(g => g.id.toString() === group.id.toString())

        if (!selectedGroup) return group

        return {
          ...group,
          subgroups: group.subgroups.map((sub: Subgroup<IItem>) => {
            const selectedSubgroup = selectedGroup.subgroups?.find((s: ISubgroup) => s.id.toString() === sub.id.toString())

            const items = sub.items || []

            const selectedItems = (selectedSubgroup?.aromas ?? [])
              .map((aroma: any) => {
                return typeof aroma === 'object' ? Number(aroma.id) : Number(aroma)
              })
              .filter((id: number) => !isNaN(id) && items.some(item => item.id === id))

            return {
              ...sub,
              items,
              selectedItems,
            }
          }),
        }
      })

    case 'flavor':
      return sourceGroups.map(group => {
        const subgroup = group.subgroups[0]
        if (!subgroup) return group

        return {
          ...group,
          subgroups: subgroup.items.map((item: any) => ({
            id: item.id,
            name: item.name,
            colorHex: item.colorHex,
          })),
          selectedItems: subgroup.selectedItems,
        }
      })

    case 'characteristic':
      return sourceGroups.map(group => {
        const selectedGroup = selectedData.find(g => g.id.toString() === group.id.toString())

        if (!selectedGroup) return group

        return {
          ...group,
          subgroups: [],
        }
      })

    default:
      return sourceGroups
  }
}
