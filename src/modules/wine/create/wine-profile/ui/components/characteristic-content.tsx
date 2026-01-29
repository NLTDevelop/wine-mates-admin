import { Card } from '@/UIKit/shadcn/ui/card'
import { MultiSelect } from '@/UIKit/shadcn/ui/multi-select'
import { RotateCcw, X } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'
import { useGroupUI } from '../../presenters/useGroupUI'
import { NLTTooltip } from '@/UIKit/components/NLTTooltip'
import { useTranslation } from 'react-i18next'

interface CharacteristicContentProps {
  groups: any[]
  deleteGroup: (groupId: number) => void
  deleteSubgroup: (groupId: number, subgroupId: number) => void
  toggleGroupInSubgroup: (groupId: number, subgroupId: number, aromaIds: number[]) => void
  restoreGroup: (groupId: number) => void
  restoreSubgroup: (groupId: number, subgroupId: number) => void
  getSubgroupOptions: (groupId: number, subgroupId: number) => any[]
  deletedGroups: number[]
  setDeletedGroups: Dispatch<SetStateAction<number[]>>
  setDeletedSubgroups: Dispatch<SetStateAction<string[]>>
  deletedSubgroups: string[]
  isGroupDeleted: (groupId: number) => boolean
  isSubgroupDeleted: (groupId: number, subgroupId: number) => boolean
  isItems?: boolean
}

export const CharacteristicContent: React.FC<CharacteristicContentProps> = ({
  groups,
  deleteGroup,
  deleteSubgroup,
  toggleGroupInSubgroup,
  restoreGroup,
  restoreSubgroup,
  getSubgroupOptions,
  deletedGroups,
  setDeletedGroups,
  deletedSubgroups,
  setDeletedSubgroups,
  isGroupDeleted,
  isSubgroupDeleted,
  isItems = false,
}) => {
  const { t } = useTranslation('wine_profile')

  const { handleGroupDeleteOrRestore, handleSubgroupDeleteOrRestore, handleItemSelect, createSubgroupFetchOptions, getSubgroupSelectedValues } = useGroupUI({
    deletedGroups,
    deletedSubgroups,
    setDeletedGroups,
    setDeletedSubgroups,
    onDeleteGroup: deleteGroup,
    onRestoreGroup: restoreGroup,
    onDeleteSubgroup: deleteSubgroup,
    onRestoreSubgroup: restoreSubgroup,
    toggleGroupInSubgroup,
    getSubgroupOptions,
  })

  return (
    <div className="space-y-3">
      {groups.map(group => {
        const groupKey = `group-${group.id}`
        const isGroupDeletedFlag = isGroupDeleted(group.id)

        return (
          <Card key={groupKey} className={`mb-2 cursor-auto transition-all duration-300 p-1 ${isGroupDeletedFlag ? 'blur-[0.7px] bg-gray-100' : 'opacity-100 blur-0'}`}>
            <div className="flex items-start gap-2 min-w-0 w-full " onClick={() => handleGroupDeleteOrRestore(group.id)}>
              <div
                className={`h-6 w-6 rounded-full border-0 shadow-sm flex-shrink-0 transition-all duration-300 ${isGroupDeletedFlag ? 'opacity-50' : 'opacity-100'}`}
                style={{ backgroundColor: group.colorHex }}
              />

              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="flex items-start gap-2">
                  <span className={`text-foreground font-bold break-words word-wrap-break-word overflow-wrap-anywhere flex-1 ${isGroupDeletedFlag ? 'text-gray-400' : ''}`}>{group.name}</span>

                  <NLTTooltip
                    delay={500}
                    message={isGroupDeletedFlag ? t('restore_group') : t('del_group')}
                    className={`${isGroupDeletedFlag ? 'bg-blue-500/85 max-w-[300px]' : 'bg-red-500/85 max-w-[300px]'}`}
                    trigger={
                      <button className={`transition-all duration-300 cursor-pointer ${isGroupDeletedFlag ? 'text-blue-500 hover:text-blue-700' : 'text-gray-400 hover:text-red-500'}`}>
                        {isGroupDeletedFlag ? <RotateCcw className="w-5 h-5" /> : <X className="w-5 h-5" />}
                      </button>
                    }
                  />
                </div>

                {group.subgroups
                  ? group.subgroups.map((sub: any, i: number) => {
                      const subgroupKey = `subgroup-${sub.id}`
                      const isSubgroupDeletedFlag = isSubgroupDeleted(group.id, sub.id)
                      const options = getSubgroupOptions(group.id, sub.id)

                      const selectedValues = getSubgroupSelectedValues(sub)

                      return (
                        <div
                          onClick={() => handleSubgroupDeleteOrRestore(group.id, sub.id)}
                          key={subgroupKey}
                          className={`mt-2 space-y-2 transition-all duration-300 ${isSubgroupDeletedFlag || isGroupDeletedFlag ? 'blur-[0.7px]' : 'opacity-100 blur-0'}`}
                        >
                          <div className={`p-2 rounded transition-all duration-300 ${isSubgroupDeletedFlag ? 'bg-gray-200' : 'bg-gray-50'}`}>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-sm ${i === 0 ? 'font-bold' : ''} text-foreground break-words word-wrap-break-word overflow-wrap-anywhere ${
                                  isSubgroupDeletedFlag ? 'text-gray-400' : ''
                                }`}
                              >
                                {sub.name}
                              </span>
                              <div className="flex justify-end flex-1 gap-2">
                                {!isGroupDeletedFlag && (
                                  <div className="flex-1 max-w-md">
                                    {isItems && options.length > 0 ? (
                                      <MultiSelect
                                        mode="multiple"
                                        value={selectedValues}
                                        onChange={values => handleItemSelect(group.id, sub.id, values)}
                                        placeholder={t('select_options')}
                                        fetchOptions={createSubgroupFetchOptions(group.id, sub.id)}
                                        itemOptions={options}
                                        animationConfig={{
                                          popoverAnimation: 'slide',
                                          duration: 300,
                                        }}
                                        className={`w-full transition-all duration-300 ${isSubgroupDeletedFlag ? 'pointer-events-none opacity-50' : ''}`}
                                        disabled={isSubgroupDeletedFlag}
                                      />
                                    ) : null}
                                  </div>
                                )}

                                {!isGroupDeletedFlag && (
                                  <NLTTooltip
                                    delay={500}
                                    message={isSubgroupDeletedFlag ? t('restore_subgroup') : t('del_subgroup')}
                                    className={`${isSubgroupDeletedFlag ? 'bg-blue-500/85 max-w-[300px]' : 'bg-red-500/85 max-w-[300px]'}`}
                                    trigger={
                                      <button
                                        className={`transition-all duration-300 cursor-pointer ${isSubgroupDeletedFlag ? 'text-blue-500 hover:text-blue-700' : 'text-gray-400 hover:text-red-500'}`}
                                        disabled={isGroupDeletedFlag}
                                      >
                                        {isSubgroupDeletedFlag ? <RotateCcw className="w-5 h-5" /> : <X className="w-5 h-5" />}
                                      </button>
                                    }
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  : null}
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
