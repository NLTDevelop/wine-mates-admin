import { Input } from '@/UIKit/shadcn/ui/input'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'
import { NLTTooltip } from '@/UIKit/components/NLTTooltip'
import { cn } from '@/lib/utils'
import React, { useState } from 'react'
import { Button } from '../shadcn/ui/button'

interface InputWithTooltipProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export const InputWithTooltip = React.forwardRef<HTMLInputElement, InputWithTooltipProps>(({ className, error, ...props }, ref) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false)

  const togglePasswordVisibility = () => setPasswordVisible(prev => !prev)
  return (
    <div className="relative">
      <div className="relative">
        <Input
          ref={ref}
          {...props}
          type={props.type === 'password' && isPasswordVisible ? 'text' : props.type}
          placeholder={props.placeholder}
          disabled={props.disabled}
          maxLength={props.maxLength}
          onWheel={() => (document.activeElement as HTMLInputElement).blur()}
          className={cn(className, error && 'pr-8', {
            'pr-10': props.type === 'password',
            'appearance-none': props.type === 'number',
          })}
        />
        {props.type === 'password' && (
          <Button type="button" variant="ghost" size="icon" onClick={togglePasswordVisibility} className={cn('absolute top-1/2 transform -translate-y-1/2 p-0 w-8 h-8',  error ? 'right-9' : 'right-2')}>
            {isPasswordVisible ? <EyeOff /> : <Eye />}
          </Button>
        )}
      </div>
      {error && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <NLTTooltip delay={500} message={error} className="bg-red-500 max-w-75" trigger={<AlertCircle className="h-4 w-4 text-red-400" />} />
        </div>
      )}
    </div>
  )
})
