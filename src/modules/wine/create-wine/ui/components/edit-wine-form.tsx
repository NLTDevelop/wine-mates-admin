import React from 'react'
import { WineForm } from './wine-form'
import { UseFormReturn } from 'react-hook-form'
import { useEditWineForm } from '../../presenters/useEditWineForm'
import { useCachedColors } from '@/modules/wine/create/general/presenters/useCachedColors'
import { useCachedWineTypes } from '@/modules/wine/create/general/presenters/useCachedWineTypes'
import { IWines } from '@/modules/wine/list/entities/types/types'
import { WineFormData } from '../../presenters/wine-form-schema'

interface EditWineFormProps {
  wine: IWines
  onSuccess?: () => void
  onCancel?: () => void
}

export const EditWineForm: React.FC<EditWineFormProps> = ({ wine, onSuccess, onCancel }) => {
  const { form, isSubmitting, onSubmit, hasChanges, resetForm } = useEditWineForm({ wine, onSuccess })
  const { cachedColors, isLoading: colorsLoading } = useCachedColors()
  const { cachedWineTypes, isLoading: wineTypesLoading } = useCachedWineTypes()

  return (
    <WineForm
      form={form as UseFormReturn<WineFormData>}
      wineTypes={cachedWineTypes}
      mode="edit"
      onSubmit={onSubmit}
      onCancel={onCancel}
      isSubmitting={isSubmitting}
      cachedColors={cachedColors}
      colorsLoading={colorsLoading}
      wineTypesLoading={wineTypesLoading}
      hasChanges={hasChanges}
      onReset={resetForm}
    />
  )
}
