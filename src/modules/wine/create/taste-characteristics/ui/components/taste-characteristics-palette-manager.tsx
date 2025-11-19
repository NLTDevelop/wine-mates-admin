import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { TasteCharacteristicCard, CreateTasteCharacteristicSection } from '..'
import { useTasteCharacteristicsPalette } from '../../presenters/useTasteCharacteristicsPalette'
import { mockTasteCharacteristics } from '../../entities/mocks'
import { useState } from 'react'
import { BaseWineColor } from '../../../general/entities/types'

export const TasteCharacteristicsPaletteManager = () => {
  const tasteCharacteristics = mockTasteCharacteristics
  const {
    isLoading,
    isFormOpen,
    isAccordionOpen,
    characteristicLevels,
    handleAddCharacteristic,
    handleDeleteCharacteristic,
    handleToggleForm,
    handleCancelEdit,
    handleToggleAccordion,
    // handleUpdateCharacteristic,
    updateLocalCharacteristicLevels,
  } = useTasteCharacteristicsPalette()

  const [editData, setEditData] = useState<{ [key: string]: { label: string; labelEn: string } }>({})

  const handleEditDataChange = (characteristicId: string, field: string, value: string | BaseWineColor[]) => {
    setEditData(prev => ({
      ...prev,
      [characteristicId]: {
        ...(prev[characteristicId] || { label: '', labelEn: '' }),
        [field]: value,
      },
    }))
  }

  const handleSaveCharacteristic = async (characteristicId: string) => {
    const data = editData[characteristicId]
    if (data) {
      // await handleUpdateCharacteristic(characteristicId, {
      //   label: data.label,
      //   labelEn: data.labelEn,
      // })
      setEditData(prev => {
        const newData = { ...prev }
        delete newData[characteristicId]
        return newData
      })
    }
  }

  return (
    <Card>
      <CardContent className="space-y-2 sm:space-y-6 max-sm:p-0 sm:p-0">
        <div>
          <CreateTasteCharacteristicSection
            onCreateCharacteristic={handleAddCharacteristic}
            isLoading={isLoading}
            characteristicLevels={characteristicLevels['new-characteristic'] || []}
            onCharacteristicLevelsChange={levels => {
              updateLocalCharacteristicLevels('new-characteristic', levels)
            }}
          />
        </div>
        <div className="mx-auto flex flex-col justify-center gap-2 w-full">
          {tasteCharacteristics.map(characteristic => {
            const currentEditData = editData[characteristic.id]

            return (
              <div key={characteristic.id} className="flex flex-col">
                <TasteCharacteristicCard
                  data={characteristic}
                  onRemove={handleDeleteCharacteristic}
                  isLoading={isLoading}
                  isEditable={true}
                  onToggleForm={() => handleToggleForm(characteristic.id)}
                  isFormOpen={isFormOpen[characteristic.id] || false}
                  onCancel={() => {
                    handleCancelEdit(characteristic.id)
                    setEditData(prev => {
                      const newData = { ...prev }
                      delete newData[characteristic.id]
                      return newData
                    })
                  }}
                  onUpdateCharacteristic={id => handleSaveCharacteristic(id)}
                  isAccordionOpen={isAccordionOpen}
                  handleToggleAccordion={handleToggleAccordion}
                  characteristicLevels={characteristicLevels[characteristic.id] || []}
                  onCharacteristicLevelsChange={levels => {
                    updateLocalCharacteristicLevels(characteristic.id, levels)
                  }}
                  editData={currentEditData}
                  onEditDataChange={(field, value) => handleEditDataChange(characteristic.id, field, value)}
                />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
// import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
// import { PaletteItemActions } from '@/modules/wine/create/general/ui'

// import { BaseWineColor } from '../../../general/entities/types'
// import { cn } from '@/lib/utils'
// import { SkeletonWinePalette } from '../../../general/ui/components/skeleton-wine-palette'
// import { useDeleteModal } from '../../../general/presenters/useDeleteModal'
// import { useCallback } from 'react'
// import { WarningModal } from '@/modals/warningModal'
// import { useTranslation } from 'react-i18next'
// import { CreateTasteCharacteristicSection } from './create-taste-characteristic-section'
// import { EmptyState } from '../../../general/ui/components/empty-state'
// import { TasteCharacteristicsForm } from './taste-characteristics-form'
// import { WineTasteCharacteristics } from '../../entities/types/taste-characteristics'

// interface TasteCharacteristicsPaletteProps {
//   cachedColors: BaseWineColor[]
//   colorsLoading?: boolean
// }

// export const TasteCharacteristicsPaletteManager = ({ cachedColors, colorsLoading = false }: TasteCharacteristicsPaletteProps) => {
//   const { t } = useTranslation('wines')
//   const { deleteModal } = useDeleteModal()
//   const { tasteCharacteristics, isLoading, isFormOpen, handleAddTasteCharacteristics, handleDeleteTasteCharacteristics, handleToggleForm, handleCancelEdit, formData, updateFormData, handleSaveTasteCharacteristics, hasChanges,updateLocalCharacteristicLevels } =
//     useTasteCharacteristicsPalette(cachedColors)

//   const handleOpenDeleteModal = useCallback(
//     (groupId: string, groupNameUa: string) => {
//       deleteModal.open(groupId, groupNameUa)
//     },
//     [deleteModal]
//   )

//   const handleConfirmDelete = useCallback(() => {
//     if (deleteModal.id) {
//       handleDeleteTasteCharacteristics(deleteModal.id)
//       deleteModal.close()
//     }
//   }, [deleteModal, handleDeleteTasteCharacteristics])

//   if (isLoading && tasteCharacteristics.length === 0) {
//     return (
//       <Card>
//         <CardContent className="space-y-2 sm:space-y-6 max-sm:p-0 sm:p-0">
//           <SkeletonWinePalette />
//         </CardContent>
//       </Card>
//     )
//   }

//   return (
//     <Card>
//       <CardContent className="space-y-2 sm:space-y-6 max-sm:p-0 sm:p-0">
//         <div>
//           <CreateTasteCharacteristicSection onCreateCharacteristic={handleAddTasteCharacteristics} isLoading={isLoading} cachedColors={cachedColors} characteristicLevels={characteristicLevels['new-characteristic'] || []}
//             onCharacteristicLevelsChange={levels => {
//               updateLocalCharacteristicLevels('new-characteristic', levels)
//             }}/>
//         </div>
//          {!isLoading && tasteCharacteristics?.length === 0 && <EmptyState type="taste-characteristics" />}
//         <div className="mx-auto flex flex-col justify-center gap-2 w-full">
//           {tasteCharacteristics?.map((tc:WineTasteCharacteristics) => {
//             const isEditing = isFormOpen[tc.id] || false
//             const currentFormData = formData[tc.id]
//             return (
//               <div
//                 key={tc.id}
//                 className={cn(
//                   'border-1 border-input rounded-md transition-all cursor-default',
//                   isEditing && 'rounded-md bg-card text-card-foreground shadow-sm card-spacing box-border border-border transition-colors border-dashed p-0'
//                 )}
//               >
//                 <div className={cn(!isEditing && 'p-2')}>
//                   {!isEditing ? (
//                     <div className="flex justify-between items-center w-full">
//                       <div className="flex items-center gap-2">
//                         <span className="font-medium">
//                           {tс.nameUa} ({tс.nameEn})
//                         </span>
//                         {tс.colors?.map((color: BaseWineColor) => (
//                           <div key={color.id} className="bg-muted px-2 py-1 rounded text-xs">
//                             {color.nameUa}
//                           </div>
//                         ))}
//                       </div>
//                       <PaletteItemActions
//                         isLoading={isLoading}
//                         onRemove={handleConfirmDelete}
//                         dataId={tс.id}
//                         onEdit={() => handleToggleForm(tс.id)}
//                         showEditButton={true}
//                         isHeader
//                         deleteModal={() => handleOpenDeleteModal(tс.id, tс.nameUa)}
//                       />
//                     </div>
//                   ) : (
//                     currentFormData && (
//                       <TasteCharacteristicsForm
//                         formData={currentFormData}
//                         onFormDataChange={(field, value) => updateFormData(tc.id, field, value)}
//                         onSave={() => handleSaveTasteCharacteristics(tc.id)}
//                         onCancel={() => handleCancelEdit(tc.id)}
//                         cachedColors={cachedColors}
//                         isLoading={isLoading || colorsLoading}
//                         mode="edit"
//                         hasChanges={hasChanges(tc.id)}
//                         levels={tc.levels || []}
//                         setNewLevelItemData={()=>updateLocalCharacteristicLevels('new-characteristic',tc.levels)}
//                         characteristicId={tc.id}
//                       />
//                     )
//                   )}
//                 </div>
//               </div>
//             )
//           })}
//         </div>
//         <WarningModal
//           title={t('modal.delete_title', { slug: 'тип вина' })}
//           actionTitle={t('modal.delete_action')}
//           description={t('modal.delete_description', { name: deleteModal.nameUa, slug: 'Тип вина' })}
//           isOpen={deleteModal.isOpen}
//           onClose={deleteModal.close}
//           onSubmit={handleConfirmDelete}
//         />
//       </CardContent>
//     </Card>
//   )
// }
