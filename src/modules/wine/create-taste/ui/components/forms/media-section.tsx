import { memo } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Card } from '@/UIKit/shadcn/ui/card'
import { Label } from '@/UIKit/shadcn/ui/label'
import { NLTFormSingleFileDropZone } from '@/UIKit/components/NLTFormSingleFileDropZone'
import { WineFormData } from '../../../presenters/wine-form-schema'

interface MediaSectionProps {
  form: UseFormReturn<WineFormData>
}

export const MediaSection = memo(({ form }: MediaSectionProps) => {
  const { t } = useTranslation('wines')

  return (
    <>
      <Label>{t('media')}</Label>
      <Card className="p-2 bg-background">
        <div className="grid grid-cols-1">
          <NLTFormSingleFileDropZone form={form} name="image" formLabel="" maxSizeInMB={10} acceptedTypes={['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']} />
        </div>
      </Card>
    </>
  )
})

MediaSection.displayName = 'MediaSection'
