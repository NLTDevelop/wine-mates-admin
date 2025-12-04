import { FC } from 'react'
import { Controller } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/UIKit/shadcn/ui/form'
import { NLTSingleFileDropZone } from '../NLTSingleFileDropZone'

interface NLTFormSingleFileDropZoneProps {
  form: any
  name: string
  formLabel?: string
  disabled?: boolean
  maxSizeInMB?: number
  error?: string
  acceptedTypes?: string[]
}

export const NLTFormSingleFileDropZone: FC<NLTFormSingleFileDropZoneProps> = ({
  form,
  name,
  formLabel,
  disabled,
  maxSizeInMB = 5,
  error,
  acceptedTypes = ['image/png', 'image/jpeg', 'image/jpg'],
}) => {
  const handleFileSelect = (file: File | null) => {
    form.setValue(name, file, { shouldValidate: true, shouldDirty: true })
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {formLabel && <FormLabel>{formLabel}</FormLabel>}
          <FormControl>
            <Controller
              control={form.control}
              name={name}
              render={({ field: controllerField }) => {
                if (controllerField.value !== field.value) {
                  controllerField.onChange(field.value)
                }

                return <NLTSingleFileDropZone onFileSelect={handleFileSelect} disabled={disabled} error={error} maxSizeMB={maxSizeInMB} acceptedTypes={acceptedTypes} file={field.value} />
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
