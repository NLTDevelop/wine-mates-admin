
import { IWines } from '@/modules/wine/list/entities/types/types'
import { useUpdateWine } from './useUpdateWine'
import {  useWineForm } from './useWineForm'
import { WineFormData } from './wine-form-schema'

interface UseEditWineFormProps {
  wine: IWines
  onSuccess?: () => void
}

export const useEditWineForm = ({ wine, onSuccess }: UseEditWineFormProps) => {
  const { updateWine, isUpdating } = useUpdateWine()

  const form = useWineForm({ initialData: wine })

  const onSubmit = async (data: WineFormData): Promise<void> => {
   
    try {
      await updateWine({ id: wine.id!, data })
      onSuccess?.()
    } catch (error) {
      throw error
    }
  }

  return { form, isSubmitting: isUpdating, onSubmit }
}
