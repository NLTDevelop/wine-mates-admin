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
    handleUpdateCharacteristic,
    updateLocalCharacteristicLevels,
  } = useTasteCharacteristicsPalette()

  const [editData, setEditData] = useState<{ [key: string]: { label: string; labelEn: string } }>({})

  const handleEditDataChange = (characteristicId: string, field: string, value: string| BaseWineColor[]) => {
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
      await handleUpdateCharacteristic(characteristicId, {
        label: data.label,
        labelEn: data.labelEn,
      })
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
