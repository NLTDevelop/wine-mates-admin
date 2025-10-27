import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { useWineColors } from '../../../presenters/useWineColors'
import { CreateCategorySection } from './components/create-category-section'
import { PaletteItem } from './components/palette-item'
import { mockWineColorCategories } from '../../../entities/color/mock'
import { AddColorSection } from './components/add-color-section'

export const ColorPaletteManager = () => {
  const categories = mockWineColorCategories
  const { categoryFormData, selectedCategory, isLoading, canAddColor, addCategory, updateCategoryFormData, updateTone, selectCategory, handleDeleteCategory, handleAddColor, baseHex } = useWineColors()

  const handleAddCategory = (categoryData: { value: string; label: string; labelEn: string }) => {
    addCategory(categoryData)
  }

  const handleLabelChange = (value: string) => {
    updateCategoryFormData({ label: value })
  }

  const handleLabelEnChange = (value: string) => {
    updateCategoryFormData({ labelEn: value })
  }

  const handleCategoryClick = (category: string) => {
    !selectedCategory ? selectCategory(category) : selectCategory('')
  }

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div>
          <CreateCategorySection onCreateCategory={handleAddCategory} isLoading={isLoading} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {categories.map(category => (
            <PaletteItem key={category.value} data={category} handleClick={() => handleCategoryClick(category.value)} onRemove={() => handleDeleteCategory(category.value)} isLoading={isLoading} />
          ))}
        </div>

        {selectedCategory && (
          <AddColorSection
            categoryFormData={categoryFormData}
            baseHex={baseHex}
            isLoading={isLoading}
            canAddColor={!!canAddColor}
            onLabelChange={handleLabelChange}
            onLabelEnChange={handleLabelEnChange}
            onToneChange={updateTone}
            onAddColor={handleAddColor}
          />
        )}
      </CardContent>
    </Card>
  )
}
