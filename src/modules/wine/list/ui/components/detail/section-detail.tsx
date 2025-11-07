import { cn } from '@/lib/utils'
import React from 'react'

interface DetailSectionProps {
  title: string
  icon: React.ReactNode
  fields: Array<{ label: string; value: string | undefined } | null>
}

export const DetailSection: React.FC<DetailSectionProps> = ({ title, icon, fields }) => {
  return (
    <section>
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field, index) => (
          <div key={index} className={cn('flex justify-between items-center py-2', field && 'border-b border-input')}>
            <span className="text-sm font-medium text-gray-500">{field?.label}</span>
            <span className="text-sm text-foreground">{field?.value}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
