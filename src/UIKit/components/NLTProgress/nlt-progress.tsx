import { cn } from '@/lib/utils'
import { FC } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const progressVariants = cva('animate-spin', {
  variants: {
    color: {
      primary: 'text-primary',
      default: '',
    },
    size: {
      default: '',
      sm: '',
      lg: 'w-20 h-20',
    },
  },
  defaultVariants: {
    size: 'default',
    color: 'default',
  },
})

interface IPProps extends VariantProps<typeof progressVariants> {
  wrapClassName?: string
  className?: string
  fullWidth?: boolean
}

export const NLTProgress: FC<IPProps> = props => {
  const { className, fullWidth = false, size, color, wrapClassName } = props
  return (
    <div className={cn(wrapClassName, 'w-fit h-auto', Boolean(fullWidth) && 'flex grow w-full h-full items-center justify-center')}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(progressVariants({ size, color, className }))}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </div>
  )
}
