import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useState, useCallback } from 'react'
import { z } from 'zod'

const addWineToWinerySchema = z.object({
  wineIds: z.array(z.string()).min(1, 'Оберіть хоча б одне вино')
})

type AddWineToWineryFormValues = z.infer<typeof addWineToWinerySchema>

interface WineOption {
  label: string
  value: string
}

export const useAddWineToWineryForm = (availableOptions: WineOption[] = []) => {
  const [selectedWineIds, setSelectedWineIds] = useState<string[]>([])
  const [selectedOptions, setSelectedOptions] = useState<WineOption[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<AddWineToWineryFormValues>({
    resolver: zodResolver(addWineToWinerySchema),
    defaultValues: {
      wineIds: []
    }
  })

const handleWineChange = useCallback(
  (values: string | string[]) => {
    const valuesArray = Array.isArray(values) ? values : [values];
    
    setSelectedWineIds(valuesArray);
    form.setValue('wineIds', valuesArray);
    
    const options = availableOptions.filter((option) => valuesArray.includes(option.value));
    setSelectedOptions(options);
  },
  [form, availableOptions]
);

  const resetForm = useCallback(() => {
    setSelectedWineIds([])
    setSelectedOptions([])
    form.reset({ wineIds: [] })
  }, [form])

  return {
    form,
    isSubmitting,
    setIsSubmitting,
    onSubmit: form.handleSubmit,
    resetForm,
    selectedWineIds,
    handleWineChange,
    selectedOptions
  }
}