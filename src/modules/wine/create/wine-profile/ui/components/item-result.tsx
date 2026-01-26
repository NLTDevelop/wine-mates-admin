import { Group, IItem } from '../../enteties/items-types'

interface ItemResultProps {
  groups: Group[]
}

export const ItemResult = ({ groups }: ItemResultProps) => {
  return groups.map((group, groupIndex) => (
    <div key={groupIndex} className="mb-2">
      <div className="flex items-start gap-2 min-w-0 w-full">
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full border-0 shadow-sm flex-shrink-0" style={{ backgroundColor: group.colorHex }} />
            <span className="text-foreground font-medium break-words word-wrap-break-word overflow-wrap-anywhere flex-1">{group.name}</span>
          </div>

          <div className="bg-input ml-6 my-2 rounded">
            {group?.subgroups?.map((subgroup, subgroupIndex) => (
              <div key={subgroupIndex} className="px-2 py-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground break-words word-wrap-break-word overflow-wrap-anywhere">{subgroup.subgroupName}</span>

                  {subgroup.items?.length > 0 && (
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-1 ml-2">
                        <span className="text-sm">({subgroup.items.map((item: IItem) => item.name).join(', ')})</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ))
}
