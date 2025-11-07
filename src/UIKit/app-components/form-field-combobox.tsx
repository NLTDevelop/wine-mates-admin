import { FC } from 'react'

import { FormControl, FormField, FormItem, FormLabel } from '@/UIKit/shadcn/ui/form'
import { UseFormReturn } from 'react-hook-form'
import { FormCombobox } from './form-combobox'

export interface IOption {
  value: string
  label: string
}

interface FormFieldComboboxProps {
  form: UseFormReturn<any>
  formLabel: string
  name: string
  disabled?: boolean
  placeholder?: string
  searchLabel?: string
  fetchOptions: () => Promise<IOption[]>
  options?: IOption[]
  error?: string
}

export const FormFieldCombobox: FC<FormFieldComboboxProps> = ({ form, formLabel, name, disabled, placeholder, searchLabel, fetchOptions, options, error }) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{formLabel}</FormLabel>
          <FormControl>
            <FormCombobox
              value={field.value}
              onChange={field.onChange}
              placeholder={placeholder}
              searchLabel={searchLabel}
              disabled={disabled}
              fetchOptions={fetchOptions}
              itemOptions={options}
              error={(form.formState.errors[name]?.message as string) || error}
              onBlur={field.onBlur}
            />
          </FormControl>
        </FormItem>
      )}
    />
  )
}
