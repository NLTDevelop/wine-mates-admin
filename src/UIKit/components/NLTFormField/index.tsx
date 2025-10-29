import { useState } from 'react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/UIKit/shadcn/ui/form'
import { Input } from '@/UIKit/shadcn/ui/input'
import { Textarea } from '@/UIKit/shadcn/ui/textarea'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Eye, EyeOff } from 'lucide-react'
import classNames from 'classnames'
import { FieldValues, Path, UseFormReturn } from 'react-hook-form'

interface IProps<T extends FieldValues> {
  form: UseFormReturn<T>
  name: Path<T>
  formLabel: string
  type?: string
  placeholder?: string
  textArea?: boolean
  textAreaMinHeight?: number
  disabled?: boolean
  maxLength?: number
  required?: boolean
}

export function NLTFormField<T extends FieldValues>({ form, formLabel, type = 'text', name, placeholder, textArea, textAreaMinHeight = 150, disabled, maxLength, required = false }: IProps<T>) {
  const [isPasswordVisible, setPasswordVisible] = useState(false)

  const togglePasswordVisibility = () => setPasswordVisible(prev => !prev)

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-1">
          <FormLabel className="font-normal text-base leading-5">
            {formLabel}
            {required && '*'}
          </FormLabel>
          <FormControl>
            {textArea ? (
              <Textarea className="font-normal text-base leading-5" placeholder={placeholder} disabled={disabled} maxLength={maxLength} style={{ height: textAreaMinHeight }} {...field} />
            ) : (
              <div className="relative">
                <Input
                  type={type === 'password' && isPasswordVisible ? 'text' : type}
                  placeholder={placeholder}
                  disabled={disabled}
                  maxLength={maxLength}
                  onWheel={() => (document.activeElement as HTMLInputElement).blur()}
                  className={classNames('font-normal text-base leading-5', {
                    'pr-10': type === 'password',
                    'appearance-none': type === 'number',
                  })}
                  {...field}
                />
                {type === 'password' && (
                  <Button type="button" variant="ghost" size="icon" onClick={togglePasswordVisibility} className="absolute right-2 top-1/2 transform -translate-y-1/2 p-0 w-8 h-8">
                    {isPasswordVisible ? <EyeOff /> : <Eye />}
                  </Button>
                )}
              </div>
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
