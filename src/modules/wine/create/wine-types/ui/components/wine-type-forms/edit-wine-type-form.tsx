import { Card, CardContent, CardHeader, CardTitle } from "@/UIKit/shadcn/ui/card"
import { Button } from "@/UIKit/shadcn/ui/button"
import { Input } from "@/UIKit/shadcn/ui/input"
import { Label } from "@/UIKit/shadcn/ui/label"
import { X, Save } from "lucide-react"
import { WineType } from "../../../entities/types/wine-type"
import { useWineTypeForm } from "../../../presenters/useWineTypeForm"
import { useWineOptions, useWineOptionsMock } from "../../../presenters/useWineOptions"
import { MultiSelect } from "@/UIKit/shadcn/ui/multi-select"

interface EditWineTypeFormProps {
  wineType: WineType
  onSubmit: (wineType: WineType) => void
  onCancel: () => void
  isLoading: boolean
}

export const EditWineTypeForm = ({ 
  wineType, 
  onSubmit, 
  onCancel, 
  isLoading 
}: EditWineTypeFormProps) => {
  const {
    formData,
    handleSubmit,
    handleChange,
    canSubmit,
    isLoading: formLoading
  } = useWineTypeForm({
    initialData: wineType,
    onSubmit,
    isLoading
  })

  const {
    fetchColors,
    fetchAromas,
    fetchFlavorNotes,
    fetchFlavorCharacteristics
  } = useWineOptionsMock()

  return (
    <Card className="border-l-4 border-l-yellow-500">
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-center">
          Редактирование типа вина
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={formLoading}
          >
            <X className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="label">Название типа вина *</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => handleChange('label', e.target.value)}
                placeholder="Красное, Белое, Розовое..."
                required
                disabled={formLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="labelEn">Английское название</Label>
              <Input
                id="labelEn"
                value={formData.labelEn}
                onChange={(e) => handleChange('labelEn', e.target.value)}
                placeholder="Red, White, Rosé..."
                disabled={formLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="colors">Цвета вина *</Label>
            <MultiSelect
              value={formData.colors}
              onChange={(value) => handleChange('colors', value)}
              placeholder="Выберите цвета..."
              searchLabel="Поиск цветов..."
              fetchOptions={fetchColors}
              mode="multiple"
              disabled={formLoading}
            />
          </div>


          <div className="space-y-2">
            <Label htmlFor="aromas">Ароматы *</Label>
            <MultiSelect
              value={formData.aromas}
              onChange={(value) => handleChange('aromas', value)}
              placeholder="Выберите ароматы..."
              searchLabel="Поиск ароматов..."
              fetchOptions={fetchAromas}
              mode="multiple"
              disabled={formLoading}
            />
          </div>


          <div className="space-y-2">
            <Label htmlFor="flavorNotes">Вкусовые ноты</Label>
            <MultiSelect
              value={formData.flavorNotes}
              onChange={(value) => handleChange('flavorNotes', value)}
              placeholder="Выберите вкусовые ноты..."
              searchLabel="Поиск вкусовых нот..."
              fetchOptions={fetchFlavorNotes}
              mode="multiple"
              disabled={formLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="flavorCharacteristics">Вкусовые характеристики</Label>
            <MultiSelect
              value={formData.flavorCharacteristics}
              onChange={(value) => handleChange('flavorCharacteristics', value)}
              placeholder="Выберите вкусовые характеристики..."
              searchLabel="Поиск характеристик..."
              fetchOptions={fetchFlavorCharacteristics}
              mode="multiple"
              disabled={formLoading}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={formLoading}
            >
              Отмена
            </Button>
            <Button 
              type="submit" 
              disabled={formLoading || !canSubmit}
            >
              <Save className="w-4 h-4 mr-2" />
              {formLoading ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}