import { FC } from 'react'

import { cn } from '@/lib/utils'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/UIKit/shadcn/ui/tooltip'

interface IProps {
  trigger: React.ReactNode
  message: string
  delay: number
  isOpen?: boolean
  className?: string
}
export const NLTTooltip: FC<IProps> = ({ trigger, message, delay, isOpen, className }) => (
  <Tooltip delayDuration={delay} open={isOpen}>
    <TooltipTrigger asChild>{trigger}</TooltipTrigger>
    <TooltipContent className={cn('max-w-[200px] h-auto break-words', className)}>
      <p>{message}</p>
    </TooltipContent>
  </Tooltip>
)
