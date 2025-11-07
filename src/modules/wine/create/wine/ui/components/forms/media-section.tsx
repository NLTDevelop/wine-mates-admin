import { UseFormReturn } from 'react-hook-form'
import { WineFormData } from '../../../presenters/wine-form-schema'
import { Card } from '@/UIKit/shadcn/ui/card'
import { memo } from 'react'
import { NLTFormFilesDropZone } from '@/UIKit/components/NLTFormFilesDropZone'
import { Label } from '@/UIKit/shadcn/ui/label'
import { useTranslation } from 'react-i18next'

export const MediaSection = memo(({ form }: { form: UseFormReturn<WineFormData> }) => {
  const { t } = useTranslation('wines')
  return (
    <>
      <Label>{t('media') + '*'}</Label>
      <Card className="p-4 bg-background">
        <div className="grid grid-cols-1 mt-2">
          <NLTFormFilesDropZone form={form} name="media" />
        </div>
      </Card>
    </>
  )
})

MediaSection.displayName = 'MediaSection'
