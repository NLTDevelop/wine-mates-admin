import { Card, CardContent } from '@/UIKit/shadcn/ui/card'

import { Button } from '@/UIKit/shadcn/ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useWineTypes } from '../../presenters/useWineTypes'
import { mockWineTypes } from '../../entities/mock'
import { CreateWineTypeForm, WineTypeCard } from '..'
import { useTranslation } from 'react-i18next'

export const WineTypeManager = () => {
  const { t } = useTranslation('wines')

  const wineTypes = mockWineTypes
  const { createWineType, updateWineType, deleteWineType, isLoading } = useWineTypes()

  const [isCreating, setIsCreating] = useState(false)

  return (
    <Card className=" ">
      <CardContent className="space-y-6 max-sm:p-0 sm:p-0">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{t('types.wine_types')}</h2>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="w-4 h-4 mr-2" />
            {t('button.add_new_type')}
          </Button>
        </div>

        {isCreating && <CreateWineTypeForm onSubmit={createWineType} onCancel={() => setIsCreating(false)} isLoading={isLoading} />}

        <div className="space-y-4">
          {wineTypes.map(wineType => (
            <WineTypeCard key={wineType.value} wineType={wineType} onUpdate={updateWineType} onDelete={deleteWineType} isLoading={isLoading} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
