import { cn } from '@/lib/utils'
import { Label } from './label'

export const FormField = ({
  name,
  label,
  children,
  error,
  className,
}: {
  name?: string
  label: string
  children: React.ReactNode
  error?: string
  className?: string
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={name}>{label}</Label>
      {children}
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  )
}

export const Form = ({
  children,
  onSubmit,
  className,
}: {
  children: React.ReactNode
  onSubmit: (e: React.FormEvent) => void
  className?: string
}) => {
  return (
    <form onSubmit={onSubmit} className={cn('space-y-4', className)}>
      {children}
    </form>
  )
}
