import { Input } from '@/UIKit/shadcn/ui/input'
import { AlertCircle } from 'lucide-react'
import { NLTTooltip } from '@/UIKit/components/NLTTooltip'
import { cn } from '@/lib/utils'
import React from 'react'

interface InputWithTooltipProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export const InputWithTooltip = React.forwardRef<HTMLInputElement, InputWithTooltipProps>(({ className, error, ...props }, ref) => {
  return (
    <div className="relative">
      <Input className={cn(className, error && 'pr-8')} ref={ref} {...props} />
      {error && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <NLTTooltip delay={500} message={error} className="bg-red-500 max-w-[300px]" trigger={<AlertCircle className="h-4 w-4 text-red-400" />} />
        </div>
      )}
    </div>
  )
})
