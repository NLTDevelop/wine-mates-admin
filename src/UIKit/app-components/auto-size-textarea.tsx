import { cn } from '@/lib/utils'
import { Textarea } from '@/UIKit/shadcn/ui/textarea'
import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'

interface AutoSizeTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value?: string
}

export const AutoSizeTextarea = forwardRef<HTMLTextAreaElement, AutoSizeTextareaProps>(({ value, className, ...props }, ref) => {
  const localRef = useRef<HTMLTextAreaElement>(null)

  useImperativeHandle(ref, () => localRef.current!)

  const adjustHeight = () => {
    const textarea = localRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }

  useEffect(() => {
    adjustHeight()
  }, [value])

  return <Textarea {...props} ref={localRef} value={value} className={cn('overflow-hidden', className)} rows={1} />
})

AutoSizeTextarea.displayName = 'AutoSizeTextarea'
