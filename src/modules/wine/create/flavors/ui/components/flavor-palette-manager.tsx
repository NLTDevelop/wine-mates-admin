import { Button } from '@/UIKit/shadcn/ui/button'
import { Input } from '@/UIKit/shadcn/ui/input'
import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useWineFlavor } from '../../presenters/useWineFlavors'
import { useState } from 'react'
import { FlavorGroupCard } from './flavor-group-card'
import { CreateFlavorGroupSection } from './create-flavor-group-section'
import { mockAromaGroups } from '../../entities/mock'

export const FlavorPaletteManager = () => {
  const { t } = useTranslation('wines')
  const { t: tc } = useTranslation('common')

  const aromaGroups = mockAromaGroups

  const { isLoading, createGroup, updateGroup, deleteGroup, createItem } = useWineFlavor()

  const [isFormOpen, setIsFormOpen] = useState<{ [groupId: string]: boolean }>({})
  const [newItemData, setNewItemData] = useState<{
    [groupId: string]: {
      name: string
      nameEn: string
      description?: string
    }
  }>({})

  const handleAddGroup = (groupData: { value: string; label: string; labelEn: string }) => {
    createGroup(groupData)
  }

  const handleDeleteGroup = (groupId: string) => {
    deleteGroup(groupId)
  }

  const handleAddItem = (groupId: string) => {
    const itemData = newItemData[groupId]
    if (itemData) {
      createItem(groupId, itemData)
      setNewItemData(prev => ({
        ...prev,
        [groupId]: { name: '', nameEn: '', description: '' },
      }))
    }
  }

  const handleToggleForm = (groupId: string) => {
    setIsFormOpen(prev => ({
      ...prev,
      [groupId]: !prev[groupId],
    }))
  }

  const handleCancelEdit = (groupId: string) => {
    setNewItemData(prev => ({
      ...prev,
      [groupId]: { name: '', nameEn: '', description: '' },
    }))
    setIsFormOpen(prev => ({ ...prev, [groupId]: false }))
  }

  const updateItemFormData = (groupId: string, field: string, value: string) => {
    setNewItemData(prev => ({
      ...prev,
      [groupId]: {
        ...prev[groupId],
        [field]: value,
      },
    }))
  }

  const canAddItem = (groupId: string) => {
    const data = newItemData[groupId]
    return data?.name && data.nameEn
  }

  return (
    <Card>
      <CardContent className="space-y-6 max-sm:p-0 sm:p-0">
        <div>
          <CreateFlavorGroupSection onCreateGroup={handleAddGroup} isLoading={isLoading} />
        </div>
        <div className="mx-auto flex flex-col justify-center gap-2 w-2/3">
          {aromaGroups.map(group => (
            <div key={group.id} className="flex flex-col">
              <FlavorGroupCard
                data={group}
                onRemove={handleDeleteGroup}
                isLoading={isLoading}
                isEditable={true}
                onToggleForm={() => handleToggleForm(group.id)}
                isFormOpen={isFormOpen[group.id] || false}
                onCancel={() => handleCancelEdit(group.id)}
              />

              {isFormOpen[group.id] && (
                <div className="border-1 border-input p-4 rounded-b-md">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">{t('add_new_aroma')}</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">{t('aroma_name_ua')} *</label>
                        <Input
                          value={newItemData[group.id]?.name || ''}
                          onChange={e => updateItemFormData(group.id, 'name', e.target.value)}
                          placeholder={t('aroma_name_ua')}
                          className="w-full"
                          autoFocus
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">{t('aroma_name_en')} *</label>
                        <Input value={newItemData[group.id]?.nameEn || ''} onChange={e => updateItemFormData(group.id, 'nameEn', e.target.value)} placeholder={t('aroma_name_en')} className="w-full" />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">{t('description')}</label>
                      <Input
                        value={newItemData[group.id]?.description || ''}
                        onChange={e => updateItemFormData(group.id, 'description', e.target.value)}
                        placeholder={t('aroma_description')}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-6">
                    <Button variant="outline" onClick={() => handleCancelEdit(group.id)}>
                      {tc('button.cancel')}
                    </Button>
                    <Button onClick={() => handleAddItem(group.id)} disabled={!canAddItem(group.id) || isLoading}>
                      <Plus className="w-4 h-4 mr-2" />
                      {isLoading ? tc('button.saving') : tc('button.add')}
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
