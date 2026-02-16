import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateWineRequest, IWines } from '@/modules/wine/list/entities/types/types'
import { createUnionWinesFormSchema, UnionWinesFormData } from './union-wines-form-schema'

interface UseUnionWinesFormProps {
  initialData?: Partial<UnionWinesFormData> | CreateWineRequest | IWines
}

export const useUnionWinesForm = ({ initialData }: UseUnionWinesFormProps = {}) => {
  const formData = initialData 

  const form = useForm({
    resolver: zodResolver(createUnionWinesFormSchema()),
    defaultValues: {
      id: formData?.id || '',
      name: formData?.name || '',
      // countryId: formData?.countryId || null,
      // regionId: formData?.regionId || null,
      // producer: formData?.producer || '',
      // image: formData?.image ?? null,
    },
    mode: 'onChange',
  })

  return form
}
