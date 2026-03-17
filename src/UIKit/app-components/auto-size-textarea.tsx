import { Textarea } from '@/UIKit/shadcn/ui/textarea'
import { useEffect, useRef } from 'react'

interface AutoSizeTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value?: string
}

export const AutoSizeTextarea = ({ value, className, ...props }: AutoSizeTextareaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      const newHeight = Math.max(textarea.scrollHeight, 60)
      textarea.style.height = `${newHeight}px`
    }
  }, [value])

  return <Textarea ref={textareaRef} value={value} className={className} rows={1} {...props} />
}
