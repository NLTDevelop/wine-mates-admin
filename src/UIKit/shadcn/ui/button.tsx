import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { Loader2 } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-base leading-5 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground shadow hover:bg-primary/80! hover:shadow-lg active:bg-primary/70 focus-visible:ring-primary/40',

        secondary: 'bg-secondary text-[var(--color-card)] shadow-sm hover:bg-secondary/90! hover:shadow-md active:bg-secondary/60 focus-visible:ring-secondary/40',

        outline: 'border border-border bg-transparent text-foreground hover:bg-muted/50! hover:border-muted-foreground/40 active:bg-muted/30 focus-visible:ring-border',

        edit: 'border border-primary text-primary bg-transparent hover:bg-primary/10! hover:border-primary/70 active:bg-primary/20 focus-visible:ring-primary/30',

        delete: 'bg-error text-[var(--color-card)] shadow-sm hover:bg-destructive/80! hover:shadow-lg active:bg-destructive/70 focus-visible:ring-destructive/40',

        archive: 'bg-muted text-muted-foreground shadow-sm hover:bg-muted/60 hover:text-foreground/90! active:bg-muted/50 focus-visible:ring-muted-foreground/30',

        ghost: 'hover:bg-accent/50 hover:text-accent-foreground active:bg-accent/40 focus-visible:ring-accent/30',

        link: 'text-foreground underline-offset-4  hover:underline active:text-primary/60 focus-visible:ring-primary/30 focus-visible:underline',
      },
      size: {
        default: 'h-10 px-4 py-2 text-base',
        sm: 'h-8 px-3 text-sm',
        lg: 'h-12 px-6 text-lg',
        xl: 'h-14 px-8 text-xl',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8 text-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  fullWidth?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, isLoading = false, fullWidth = false, children, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }),"cursor-pointer", isLoading && 'cursor-wait', fullWidth && 'w-full')} ref={ref} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? <Loader2 className="animate-spin" /> : children}
    </Comp>
  )
})
Button.displayName = 'Button'

export { Button, buttonVariants }
