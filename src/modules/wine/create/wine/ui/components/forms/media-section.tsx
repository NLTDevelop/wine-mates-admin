import { UseFormReturn } from 'react-hook-form'
import { WineFormData } from '../../../presenters/wine-form-schema'
import { Card } from '@/UIKit/shadcn/ui/card'
import { memo } from 'react'
import { NLTFormFilesDropZone } from '@/UIKit/components/NLTFormFilesDropZone'

export const MediaSection = memo(({ form }: { form: UseFormReturn<WineFormData> }) => {
  return (
    <Card className="mt-2 p-4 bg-background">
      <div className="grid grid-cols-1 mt-2">
        <NLTFormFilesDropZone form={form} name="media" />
      </div>
    </Card>
  )
})

MediaSection.displayName = 'MediaSection'
