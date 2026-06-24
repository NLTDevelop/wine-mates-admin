import { FormControl, FormField, FormItem, FormLabel } from '@/UIKit/shadcn/ui/form'
import { FC } from 'react'
import { NLTComplexComboboxData } from '../NLTComplexComboboxData'
import { UseFormReturn } from 'react-hook-form'
import { cn } from '@/lib/utils'

export interface IOption {
  value: any
  label: string
  imageData?: any
  [key: string]: any
}

interface IProps {
  form: UseFormReturn<any>
  formLabel?: string
  name: string
  disabled?: boolean
  placeholder?: string
  searchLabel?: string
  options?: IOption[]
  disableClear?: boolean
  is_dynamic?: boolean
  onCreateOption?: (data: string, fieldName: string) => Promise<IOption | null>
  isNumber?: boolean
}

export const NLTComplexComboboxFormFieldData: FC<IProps> = ({
  form,
  formLabel = '',
  name,
  disabled,
  placeholder,
  searchLabel,
  options = [],
  disableClear,
  is_dynamic,
  onCreateOption,
  isNumber = false,
}) => {
  const getCurrentValue = (fieldValue: any) => {
    if (!fieldValue) return null

    if (name === 'image') {
      const foundOption = options.find(
        opt => opt.imageData?.smallUrl === fieldValue?.smallUrl || opt.imageData?.mediumUrl === fieldValue?.mediumUrl || opt.imageData?.originalUrl === fieldValue?.originalUrl
      )

      if (foundOption) {
        return foundOption
      }
    }

    const foundOption = options.find(opt => String(opt.value) === String(fieldValue))

    if (foundOption) {
      return foundOption
    }

    return { value: fieldValue, label: String(fieldValue) }
  }

  const handleCreateOption = async (value: string) => {
    if (!onCreateOption) return null

    const newOption = await onCreateOption(value, name)

    if (newOption) {
      form.setValue(name, newOption.value)
    }

    return newOption
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const currentValue = getCurrentValue(field.value)

        return (
          <FormItem className="space-y-0">
            <FormLabel className={cn(disabled && 'text-gray-400 dark:text-[#525252]')}>{formLabel}</FormLabel>
            <FormControl>
              <NLTComplexComboboxData
                value={currentValue}
                onChange={(selectedOption: IOption | null) => {
                  if (name === 'image' && selectedOption?.imageData) {
                    field.onChange(selectedOption.imageData)
                  } else {
                    field.onChange(selectedOption?.value || null)
                  }
                }}
                placeholder={placeholder || formLabel}
                searchLabel={searchLabel || 'Пошук'}
                disabled={disabled}
                options={options}
                disableClear={disableClear}
                allowAdd={is_dynamic}
                onCreateOption={handleCreateOption}
                name={name}
                error={(form.formState.errors[name]?.message as string) || undefined}
                isNumber={isNumber}
              />
            </FormControl>
          </FormItem>
        )
      }}
    />
  )
}
