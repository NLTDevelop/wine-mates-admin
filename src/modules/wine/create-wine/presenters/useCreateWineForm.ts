import { useCreateWine } from './useCreateWine'
import { useWineForm } from './useWineForm'
import { WineFormData } from './wine-form-schema'

export const useCreateWineForm = () => {
  const { createWine, isCreating } = useCreateWine()
  const form = useWineForm()

  const onSubmit = async (formData: WineFormData): Promise<void> => {
    await createWine(formData as any)
  }

  return {
    form,
    isSubmitting: isCreating,
    onSubmit,
  }
}
