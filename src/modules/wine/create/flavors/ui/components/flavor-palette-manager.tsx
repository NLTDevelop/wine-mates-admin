import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { useTranslation } from 'react-i18next'
import { Input } from '@/UIKit/shadcn/ui/input'
import { Button } from '@/UIKit/shadcn/ui/button'
import { FlavorGroupCard, CreateFlavorGroupSection } from '..'
import { useFlavorPalette } from '../../presenters/useFlavorPalette'
import { Plus, Save } from 'lucide-react'
import { StatesManager } from './state-maneger'

export const FlavorPaletteManager = () => {
  const { t } = useTranslation('wines')
  const { t: tc } = useTranslation('common')

  const {
    aromaGroups,
    isLoading,
    editingGroup,
    isFormOpen,
    newItemData,
    isAccordionOpen,
    handleAddGroup,
    handleDeleteGroup,
    handleToggleForm,
    handleEditItem,
    handleCancelEdit,
    handleSaveItem,
    updateItemFormData,
    canAddItem,
    handleToggleAccordion,
    handleUpdateItemStates,
    getItemStates,
    getNewItemStates,
  } = useFlavorPalette()

  const handleEditItemClick = (groupId: string, item: any) => {
    handleEditItem(groupId, item)
  }

  return (
    <Card>
      <CardContent className="space-y-2 sm:space-y-6 max-sm:p-0 sm:p-0">
        <div>
          <CreateFlavorGroupSection onCreateGroup={handleAddGroup} isLoading={isLoading} />
        </div>
        <div className="mx-auto flex flex-col justify-center gap-2 w-full xl:w-2/3">
          {aromaGroups.map(group => (
            <div key={group.id} className="flex flex-col">
              <FlavorGroupCard
                data={group}
                onRemove={handleDeleteGroup}
                onEditItem={handleEditItemClick}
                isLoading={isLoading}
                isEditable={true}
                onToggleForm={() => handleToggleForm(group.id)}
                isFormOpen={isFormOpen[group.id] || false}
                onCancel={() => handleCancelEdit(group.id)}
                isAccordionOpen={isAccordionOpen}
                handleToggleAccordion={handleToggleAccordion}
              />

              {isAccordionOpen[group.id] && isFormOpen[group.id] && (
                <div className="border-1 border-input p-4 rounded-b-md">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">{t('flavors.aroma_name_ua')} *</label>
                        <Input
                          value={newItemData[group.id]?.name || ''}
                          onChange={e => updateItemFormData(group.id, 'name', e.target.value)}
                          placeholder={t('flavors.aroma_name_ua')}
                          className="w-full"
                          autoFocus
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">{t('flavors.aroma_name_en')} *</label>
                        <Input
                          value={newItemData[group.id]?.nameEn || ''}
                          onChange={e => updateItemFormData(group.id, 'nameEn', e.target.value)}
                          placeholder={t('flavors.aroma_name_en')}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <StatesManager
                      states={editingGroup?.editingItem ? getItemStates(editingGroup.editingItem.id) : getNewItemStates(group.id)}
                      onStatesChange={states => {
                        if (editingGroup?.editingItem) {
                          handleUpdateItemStates(editingGroup.editingItem.id, states)
                        } else {
                          handleUpdateItemStates(`new-${group.id}`, states)
                        }
                      }}
                    />
                  </div>

                  <div className="flex justify-end gap-2 mt-6">
                    <Button onClick={() => handleSaveItem(group.id)} disabled={!canAddItem(group.id) || isLoading} size="sm">
                      {editingGroup && editingGroup.groupId === group.id ? (
                        <>
                          <Save className="w-4 h-4" />
                          {isLoading ? tc('button.saving') : tc('button.save')}
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          {isLoading ? tc('button.saving') : tc('button.add')}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
