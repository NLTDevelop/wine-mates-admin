import { mapFormDataToCreateRequest } from './mappers'
import { useCreateWine } from './useCreateWine'
import { useWineForm } from './useWineForm'
import { WineFormData } from './wine-form-schema'

export const useCreateWineForm = () => {
  const { createWine, isCreating } = useCreateWine()
  const form = useWineForm()

  const onSubmit = async (formData: WineFormData): Promise<void> => {
    const createRequest = mapFormDataToCreateRequest(formData)
    await createWine(createRequest)
  }

  return {
    form,
    isSubmitting: isCreating,
    onSubmit,
  }
}
