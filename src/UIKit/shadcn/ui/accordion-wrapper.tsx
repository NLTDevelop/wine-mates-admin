'use client'

import { FC, useRef } from 'react'
import { Card, CardContent } from './card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface IProps {
  isOpen?: boolean
  onToggle?: (isOpen: boolean) => void
  label: string
  header?: React.ReactNode | string
  children: React.ReactNode
  style?: React.CSSProperties
  chevronStyle?:string
}

export const AccordionWrapper: FC<IProps> = ({ label, children, isOpen, onToggle, header,style,chevronStyle }) => {
  const value = isOpen ? label : undefined
  const contentRef = useRef<HTMLDivElement>(null)

  const handleToggle = (e: React.MouseEvent) => {
    if (contentRef.current && contentRef.current.contains(e.target as Node)) {
      return
    }
    onToggle?.(!isOpen)
  }

  return (
    <Accordion type="single" collapsible defaultValue={value} >
      <AccordionItem value={label} >
        <AccordionTrigger className="w-full cursor-pointer" onClick={handleToggle}>
          <Card className={cn( 'cursor-pointer w-full', isOpen && 'rounded-b-none'  )} style={style}>
            <CardContent className="sm:p-0 flex items-center justify-between">
              {header ? header : <h3 className="text-lg  mb-4 font-medium text-left hover:underline">{label}</h3>}
              <ChevronDown className={cn('text-muted-foreground', isOpen && 'rotate-180', chevronStyle)} />
            </CardContent>
          </Card>
        </AccordionTrigger>
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
