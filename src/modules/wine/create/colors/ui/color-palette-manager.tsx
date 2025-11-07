import { useColorPalette } from '../presenters/useColorPalette'
import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { ColorCard, CreateMainColorSection, AddColorSection } from '.'
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'

export const ColorPaletteManager = () => {
  const {
    colors,
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
    handleReorderShades,
  } = useColorPalette()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleShadesDragEnd = (event: DragEndEvent, colorId: string) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const color = colors.find(c => c.id === colorId)
      if (!color?.items) return

      const oldIndex = color.items.findIndex(item => item.id === active.id)
      const newIndex = color.items.findIndex(item => item.id === over.id)

      const newShades = arrayMove(color.items, oldIndex, newIndex)
      handleReorderShades(colorId, newShades)
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter}>
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
                  onEditColor={(colorId, shade) => handleEditColor(colorId, shade)}
                  onToggleForm={() => handleToggleForm(color.id)}
                  isFormOpen={isFormOpen[color.id] || false}
                  onCancel={() => handleCancelEdit(color.id)}
                  isAccordionOpen={isAccordionOpen}
                  handleToggleAccordion={handleToggleAccordion}
                  onShadesDragEnd={event => handleShadesDragEnd(event, color.id)}
                />

                {isAccordionOpen[color.id] && isFormOpen[color.id] && (
                  <AddColorSection
                    formData={newColorData[color.id] || { name: '', nameEn: '', shade: '' }}
                    isLoading={isLoading}
                    baseColor={color?.value}
                    canAddColor={canAddColor(color.id)}
                    onNameChange={value => updateFormData(color.id, 'name', value)}
                    onNameEnChange={value => updateFormData(color.id, 'nameEn', value)}
                    onShadeChange={value => updateFormData(color.id, 'shade', value)}
                    onToneChange={(tone, value) => updateToneData(color.id, tone, value)}
                    onSave={() => handleSaveColor(color.id)}
                    isEditing={!!editingColor && editingColor.colorId === color.id}
                    editingItemName={editingColor?.colorId === color.id ? editingColor?.item?.name : undefined}
                    showTones={true}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DndContext>
  )
}
