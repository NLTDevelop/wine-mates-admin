import { IWines } from '../entities/types/types'
import { mapFormDataToUpdateRequest } from './mappers'
import { useUpdateWine } from './useUpdateWine'
import { useWineForm } from './useWineForm'
import { WineFormData } from './wine-form-schema'

interface UseEditWineFormProps {
  wine: IWines
  onSuccess?: () => void
}

export const useEditWineForm = ({ wine, onSuccess }: UseEditWineFormProps) => {
  const { updateWine, isUpdating } = useUpdateWine()
  const form = useWineForm({ mode: 'edit', initialData: wine })

  const onSubmit = async (data: WineFormData): Promise<void> => {
    try {
      const updateData = mapFormDataToUpdateRequest(data, wine)
      await updateWine({ id: wine.id!, data: updateData })
      onSuccess?.()
    } catch (error) {
      throw error
    }
  }

  const resetForm = () => {
    form.reset()
  }

  return { form, isSubmitting: isUpdating, onSubmit, resetForm }
}
