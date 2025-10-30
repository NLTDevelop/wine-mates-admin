import { useColorPalette } from '../presenters/useColorPalette'
import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { ColorCard, CreateMainColorSection, AddColorSection } from '.'
import { mockColors } from '../entities/mock'

export const ColorPaletteManager = () => {
  const colors = mockColors
  const {
    isLoading,
    editingColor,
    isFormOpen,
    newColorData,
    handleAddCategory,
    handleDeleteCategory,
    handleToggleForm,
    handleEditColor,
    handleCancelEdit,
    handleSaveColor,
    updateFormData,
    updateToneData,
    canAddColor,
    isAccordionOpen,
    handleToggleAccordion,
  } = useColorPalette()

  return (
    <Card>
      <CardContent className="space-y-2 sm:space-y-6 max-sm:p-0 sm:p-0">
        <div>
          <CreateMainColorSection onCreateColor={handleAddCategory} isLoading={isLoading} />
        </div>
        <div className="mx-auto flex flex-col justify-center gap-2 w-full xl:w-2/3">
          {colors.map(color => (
            <div key={color.id} className="flex flex-col">
              <ColorCard
                data={color}
                onRemove={handleDeleteCategory}
                isLoading={isLoading}
                isEditable={true}
                onEditColor={shade => handleEditColor(color.id, shade)}
                onToggleForm={() => handleToggleForm(color.id)}
                isFormOpen={isFormOpen[color.id] || false}
                onCancel={() => handleCancelEdit(color.id)}
                isAccordionOpen={isAccordionOpen}
                handleToggleAccordion={handleToggleAccordion}
              />

              {isAccordionOpen[color.id] && isFormOpen[color.id] && (
                <AddColorSection
                  formData={newColorData[color.id] || { label: '', labelEn: '', value: '' }}
                  isLoading={isLoading}
                  baseColor={color?.value}
                  canAddColor={canAddColor(color.id)}
                  onLabelChange={value => updateFormData(color.id, 'label', value)}
                  onLabelEnChange={value => updateFormData(color.id, 'labelEn', value)}
                  onColorValueChange={value => updateFormData(color.id, 'value', value)}
                  onToneChange={(tone, value) => updateToneData(color.id, tone, value)}
                  onSave={() => handleSaveColor(color.id)}
                  isEditing={!!editingColor && editingColor.colorId === color.id}
                  editingColorName={editingColor?.colorId === color.id ? editingColor?.color?.label : undefined}
                  showTones={true}
                />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
