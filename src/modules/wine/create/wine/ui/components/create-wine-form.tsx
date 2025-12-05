import React from 'react'
import { WineType } from '../../../wine-types/entities/types/wine-type'
import { WineForm } from './wine-form'
import { useCreateWineForm } from '../../presenters/useCreateWineForm'
import { BaseWineColor } from '../../../general/entities/types'

interface CreateWineFormProps {
  wineTypes: WineType[]
  cachedColors: BaseWineColor[]
  colorsLoading: boolean
  wineTypesLoading: boolean
}

export const CreateWineForm: React.FC<CreateWineFormProps> = ({ wineTypes, cachedColors, colorsLoading, wineTypesLoading }) => {
  const { form, isSubmitting, onSubmit } = useCreateWineForm()

  return (
    <div className="mx-auto sm:px-4 px-1 sm:py-6 py-1 max-w-4xl">
      <WineForm
        form={form as any}
        wineTypes={wineTypes}
        mode="create"
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        cachedColors={cachedColors}
        colorsLoading={colorsLoading}
        wineTypesLoading={wineTypesLoading}
      />
    </div>
  )
}
