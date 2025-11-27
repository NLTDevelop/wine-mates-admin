import { memo } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Card } from '@/UIKit/shadcn/ui/card'
import { NLTFormFilesDropZone } from '@/UIKit/components/NLTFormFilesDropZone'
import { Label } from '@/UIKit/shadcn/ui/label'
import { WineFormData } from '../../../presenters/wine-form-schema'

interface MediaSectionProps {
  form: UseFormReturn<WineFormData>
  mode: 'create' | 'edit'
}

export const MediaSection = memo(({ form, mode }: MediaSectionProps) => {
  const { t } = useTranslation('wines')

  return (
    <>
      <Label>
        {t('media')}
        {mode === 'create' && '*'}
      </Label>
      <Card className="p-4 bg-background">
        <div className="grid grid-cols-1 mt-2">
          <NLTFormFilesDropZone form={form} name="media" />
        </div>
      </Card>
    </>
  )
})

MediaSection.displayName = 'MediaSection'
