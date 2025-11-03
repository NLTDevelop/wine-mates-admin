import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { CreateTasteSection } from '..'
import { TasteCard } from './taste-card'
import { useTastePalette } from '../../presenters/useTastePalette'

export const TastePaletteManager = () => {
  const { tastes, isLoading, isFormOpen, handleAddTaste, handleDeleteTaste, handleToggleForm, handleCancelEdit } = useTastePalette()

  return (
    <Card>
      <CardContent className="space-y-2 sm:space-y-6 max-sm:p-0 sm:p-0">
        <div>
          <CreateTasteSection onCreateTaste={handleAddTaste} isLoading={isLoading} />
        </div>
        <div className="mx-auto flex flex-col justify-center gap-2 w-full xl:w-2/3 ">
          <div className="flex gap-2 flex-col">
            {tastes.map(taste => (
              <TasteCard
                key={taste.id}
                data={taste}
                onRemove={handleDeleteTaste}
                isLoading={isLoading}
                isEditable={true}
                onToggleForm={() => handleToggleForm(taste.id)}
                isFormOpen={isFormOpen[taste.id] || false}
                onCancel={() => handleCancelEdit(taste.id)}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
