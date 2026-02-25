import { IWines } from '@/modules/wine/list/entities/types/types'
import { useUpdateWine } from './useUpdateWine'
import { mapIWinesToFormData, useWineForm } from './useWineForm'
import { WineFormData } from './wine-form-schema'
import { useFormChanges } from './useFormChanges'

interface UseEditWineFormProps {
  wine: IWines
  onSuccess?: () => void
}

export const useEditWineForm = ({ wine, onSuccess }: UseEditWineFormProps) => {
  const { updateWine, isUpdating } = useUpdateWine()

  const form = useWineForm({ initialData: wine })

  const initialFormData = mapIWinesToFormData(wine)

  const { hasChanges: formHasChanges, resetChanges } = useFormChanges(form, initialFormData as WineFormData)

  const onSubmit = async (data: WineFormData): Promise<void> => {
    try {
      await updateWine({ id: wine.id!, data })
      onSuccess?.()
      resetChanges()
    } catch (error) {
      throw error
    }
  }

  const handleReset = () => {
    resetChanges()
  }

  return { form, isSubmitting: isUpdating, onSubmit, hasChanges: formHasChanges, resetForm: handleReset }
}
