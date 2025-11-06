import { FC } from 'react'
import { FormControl, FormField, FormItem, FormLabel } from '@/UIKit/shadcn/ui/form'
import { UseFormReturn } from 'react-hook-form'
import { YearPicker } from '../shadcn/ui/year-picker'

interface YearPickerFormFieldProps {
  form: UseFormReturn<any>
  name: string
  label: string
  disabled?: boolean
  placeholder?: string
  fromYear?: number
  toYear?: number
  required?: boolean
}

export const YearPickerFormField: FC<YearPickerFormFieldProps> = ({ form, name, label, disabled, placeholder, fromYear = 1900, toYear, required = false }) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <YearPicker
              // value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              disabled={disabled}
              placeholder={placeholder}
              fromYear={fromYear}
              toYear={toYear}
              required={required}
              error={form.formState.errors[name]?.message as string}
            />
          </FormControl>
        </FormItem>
      )}
    />
  )
}
