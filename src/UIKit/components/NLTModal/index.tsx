import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/UIKit/shadcn/ui/dialog'
import { ScrollArea } from '@/UIKit/shadcn/ui/scroll-area'
import { FC, ReactNode } from 'react'

interface IProps {
  title: string
  description?: string
  children: ReactNode
  isOpen: boolean
  onClose: () => void
  className?: string
}

export const NLTModal: FC<IProps> = ({ title, description, isOpen, onClose, children, className }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${className ? className : 'sm:max-w-[525px]'}`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">{children}</ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
