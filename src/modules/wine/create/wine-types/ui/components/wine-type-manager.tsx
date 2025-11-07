import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useWineTypes } from '../../presenters/useWineTypes'
// import { WineTypeCard } from '..'
import { useTranslation } from 'react-i18next'
import { WineTypeForm } from '..'
// import { mockWineTypes } from '@/modules/wine/list/entities/mock'

export const WineTypeManager = () => {
  const { t } = useTranslation('wines')

  // const wineTypes = mockWineTypes
  const { /*wineTypes,*/ createWineType, /*updateWineType, deleteWineType,*/ isLoading } = useWineTypes()

  const [isCreating, setIsCreating] = useState(false)

  return (
    <Card>
      <CardContent className="space-y-6 max-sm:p-0 sm:p-0">
        <div className="flex justify-between items-center flex-wrap-reverse sm:flex-nowrap gap-6">
          <h2 className="text-2xl font-bold">{t('types.wine_types')}</h2>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="w-4 h-4" />
            {t('button.add_new_type')}
          </Button>
        </div>

        {isCreating && <WineTypeForm mode="create" onSubmit={createWineType} onCancel={() => setIsCreating(false)} isLoading={isLoading} />}

        {/* <div className="space-y-4">
          {wineTypes.length > 0 && wineTypes.map(wineType => <WineTypeCard key={wineType.id} wineType={wineType} onUpdate={updateWineType} onDelete={deleteWineType} isLoading={isLoading} />)}
        </div> */}
      </CardContent>
    </Card>
  )
}
