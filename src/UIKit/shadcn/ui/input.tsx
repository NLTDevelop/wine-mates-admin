import * as React from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.ComponentProps<'input'> {
  showClearButton?: boolean
  onClear?: () => void
  variant?: 'default' | 'search'
  isLoading?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type = 'text', showClearButton = true, onClear, variant = 'default', isLoading = false, value, ...props }, ref) => {
  const isSearchVariant = variant === 'search'
  const shouldShowClear = showClearButton && Boolean(value) && typeof onClear === 'function' && !isLoading
  const shouldShowLoader = isSearchVariant && isLoading

  return (
    <div className="relative">
      <input
        type="text"
        className={cn(
          'flex h-11 w-full border bg-background px-3 text-base shadow-sm transition-colors rounded-md input-focus',
          'file:border-0 file:bg-background file:text-sm file:font-medium file:text-foreground',
          'placeholder:text-muted-foreground',
          'disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',

          'bg-background text-foreground border-input ',

          {
            'pl-9': isSearchVariant,
            'pr-10': shouldShowClear || shouldShowLoader,
          },
          className
        )}
        value={value}
        ref={ref}
        style={{
          appearance: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'textfield',
        }}
        {...props}
      />

      {isSearchVariant && <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />}

      {isSearchVariant && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 flex items-center justify-center">
          {shouldShowLoader ? (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          ) : shouldShowClear ? (
            <button type="button" onClick={onClear} className="w-6 h-6 flex items-center justify-center p-1 hover:bg-muted rounded-[2px] transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
              <span className="sr-only">Clear input</span>
            </button>
          ) : null}
        </div>
      )}
    </div>
  )
})
Input.displayName = 'Input'

export { Input }
