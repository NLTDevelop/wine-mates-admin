import React from 'react'
import { useTranslation } from 'react-i18next'
import { UseFormReturn } from 'react-hook-form'
import { Form } from '@/UIKit/shadcn/ui/form'
import { Button } from '@/UIKit/shadcn/ui/button'
import { WineType } from '../../../wine-types/entities/types/wine-type'
import { WineFormData } from '../../presenters/wine-form-schema'
import { BasicInfoSection } from './forms/basic-info-section'
import { BaseWineColor } from '../../../general/entities/types'

interface WineFormProps {
  form: UseFormReturn<WineFormData>
  wineTypes: WineType[]
  mode: 'create' | 'edit'
  onSubmit: (data: WineFormData) => Promise<void>
  onCancel?: () => void
  isSubmitting?: boolean
  cachedColors: BaseWineColor[]
  colorsLoading: boolean
  wineTypesLoading: boolean
  hasChanges?: boolean
  onReset?: () => void
}

export const WineForm: React.FC<WineFormProps> = ({ form, wineTypes, mode, onSubmit, onCancel, isSubmitting = false, cachedColors, colorsLoading, wineTypesLoading, hasChanges = true, onReset }) => {
  const { t } = useTranslation('common')
  const { t: tw } = useTranslation('wines')

  const handleSubmit = (data: WineFormData) => {
    onSubmit(data)
  }

  const handleReset = () => {
    if (onReset) {
      onReset()
    } else {
      form.reset()
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
  }

  const isEditMode = mode === 'edit'
  const canSubmit = !isEditMode || (isEditMode && hasChanges)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <BasicInfoSection form={form} wineTypes={wineTypes} cachedColors={cachedColors} colorsLoading={colorsLoading} wineTypesLoading={wineTypesLoading} />

        <div className={`flex gap-4 md:flex-row flex-col ${mode !== 'create' ? 'justify-between' : 'justify-end'}`}>
          {mode === 'edit' && onCancel && (
            <Button type="button" variant="outline" onClick={handleCancel}>
              {tw('button.go_detail')}
            </Button>
          )}

          <div className="flex gap-4 ">
            <Button type="button" variant="outline" onClick={handleReset} disabled={!hasChanges || isSubmitting} className="flex-1">
              {t('button.cancel')}
            </Button>

            <Button type="submit" className="min-w-32 flex-1" disabled={isSubmitting || !canSubmit}>
              {isSubmitting ? (mode === 'create' ? t('button.creating') : t('button.saving')) : mode === 'create' ? t('button.create') : t('button.save')}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
