import { useModal } from '@/UIKit/components/NLTModal/useModal'
import { UnionWinesFormData } from './union-wines-form-schema'
import { useCreateUnionWines } from './useCreateUnionWines'
import { useUnionWinesForm } from './useUnionWinesForm'

export const useCreateUnionWinesForm = () => {
  const form = useUnionWinesForm()

   const { isOpen, onOpen, onClose } = useModal();

  const onSubmit = (formData: UnionWinesFormData) => {
    console.log('create union->', formData)
  }
  // const onSubmit = async (formData: UnionWinesFormData): Promise<void> => {
  //   await createUnionWines(formData as any)
  // }

  const onCreateOption = async (value: string) => {
    console.log('create new wine name->', value)
    const mockCreatedItem = {
      value: Math.random().toString(36).substring(7),
      label: value,
    }

    return mockCreatedItem

    // const response = await unionWinesService.create({ name: value });
    // if (response.isError || !response.data) return null;
    // const created = response.data.data;

    // return {
    //   value: created.id.toString(),
    //   label: created.name,
    // };
  }

    const wineNames = [
    { value: '1', label: 'wine1' },
    { value: '2', label: 'wine2' },
  ]

  return {
    form,
    // isSubmitting: isCreating,
    onSubmit,
    onCreateOption,
    wineNames,
    unionModal: {isOpen, onOpen, onClose}
  }
}
