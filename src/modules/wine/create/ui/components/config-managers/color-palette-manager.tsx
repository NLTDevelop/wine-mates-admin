import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { useWineColors } from '../../../presenters/useWineColors'
import { CreateCategorySection } from './components/create-category-section'
import { PaletteItem } from './components/palette-item'
import { mockWineColorCategories } from '../../../entities/color/mock'
import { AddColorSection } from './components/add-color-section'
import { useState } from 'react'
import { WineColor } from '../../../entities/types/color'

export const ColorPaletteManager = () => {
  const categories = mockWineColorCategories
  const { getCategoryFormData, updateCategoryFormData, resetCategoryFormData, updateTone, isLoading, canAddColor, addCategory, handleDeleteCategory, handleAddColor, baseHex } = useWineColors()

  const [editingColor, setEditingColor] = useState<{ categoryId: string; color?: WineColor } | null>(null)
  const [isFormOpen, setIsFormOpen] = useState<{ [categoryId: string]: boolean }>({})

  const handleAddCategory = (categoryData: { value: string; label: string; labelEn: string }) => {
    addCategory(categoryData)
  }

  const handleLabelChange = (categoryId: string, value: string) => {
    updateCategoryFormData(categoryId, { label: value })
  }

  const handleLabelEnChange = (categoryId: string, value: string) => {
    updateCategoryFormData(categoryId, { labelEn: value })
  }

  const handleToneChange = (categoryId: string, tone: 'pale' | 'medium' | 'deep', value: string) => {
    updateTone(categoryId, tone, value)
  }

  const handleToggleForm = (categoryId: string) => {
    setIsFormOpen(prev => {
      const willClose = prev[categoryId]
      if (willClose) {
        resetFormData(categoryId)
      }
      return {
        ...prev,
        [categoryId]: !prev[categoryId],
      }
    })
  }

  const resetFormData = (categoryId: string) => {
    setEditingColor(null)
    updateCategoryFormData(categoryId, { label: '', labelEn: '', tones: undefined })
  }

  const handleEditColor = (categoryId: string, color: WineColor) => {
    setEditingColor({ categoryId, color })
    setIsFormOpen(prev => ({ ...prev, [categoryId]: true }))

    updateCategoryFormData(categoryId, {
      label: color.label,
      labelEn: color.labelEn || '',
      tones: color.tones,
    })
  }

  const handleCancelEdit = (categoryId: string) => {
    setEditingColor(null)
    resetCategoryFormData(categoryId)
    setIsFormOpen(prev => ({ ...prev, [categoryId]: false }))
  }

  const handleSaveColor = (categoryId: string) => {
    if (editingColor && editingColor.color && editingColor.categoryId === categoryId) {
      // handleUpdateColor(editingColor.categoryId, editingColor.color.id, getCategoryFormData(categoryId))
    } else {
      handleAddColor(categoryId)
    }
    handleCancelEdit(categoryId)
  }

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div>
          <CreateCategorySection onCreateCategory={handleAddCategory} isLoading={isLoading} />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          {categories.map(category => (
            <div key={category.value} className="flex flex-col">
              <PaletteItem
                data={category}
                onRemove={() => handleDeleteCategory(category.value)}
                isLoading={isLoading}
                variant="category"
                isEditable={true}
                onEditColor={color => handleEditColor(category.id, color)}
                onToggleForm={() => handleToggleForm(category.id)}
                isFormOpen={isFormOpen[category.id] || false}
              />

              {isFormOpen[category.id] && (
                <AddColorSection
                  categoryFormData={getCategoryFormData(category.id)}
                  baseHex={baseHex}
                  isLoading={isLoading}
                  canAddColor={canAddColor(category.id)}
                  onLabelChange={value => handleLabelChange(category.id, value)}
                  onLabelEnChange={value => handleLabelEnChange(category.id, value)}
                  onToneChange={(tone, value) => handleToneChange(category.id, tone, value)}
                  onSave={() => handleSaveColor(category.id)}
                  onCancel={() => handleCancelEdit(category.id)}
                  isEditing={!!editingColor && editingColor.categoryId === category.id}
                  editingColorName={editingColor?.categoryId === category.id ? editingColor?.color?.label : undefined}
                />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
