import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { WineTypeCard } from '..'
import { useWineTypePalette } from '../../presenters/useWineTypePalette'
import { CreateWineTypeSection } from './create-wine-type-section'

export const WineTypeManager = () => {
  const { wineTypes, isLoading, isFormOpen, handleAddWineType, handleDeleteWineType, handleToggleForm, handleCancelEdit } = useWineTypePalette()

  return (
    <Card>
      <CardContent className="space-y-2 sm:space-y-6 max-sm:p-0 sm:p-0">
        <div>
          <CreateWineTypeSection onCreateWineType={handleAddWineType} isLoading={isLoading} />
        </div>
        <div className="mx-auto flex flex-col justify-center gap-2 w-full  ">
          <div className="flex gap-2 flex-col">
            {wineTypes?.map(wineType => (
              <WineTypeCard
                key={wineType.id}
                data={wineType}
                onRemove={handleDeleteWineType}
                isLoading={isLoading}
                isEditable={true}
                onToggleForm={() => handleToggleForm(wineType.id)}
                isFormOpen={isFormOpen[wineType.id] || false}
                onCancel={() => handleCancelEdit(wineType.id)}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
