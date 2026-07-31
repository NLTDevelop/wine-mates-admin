import React, { useEffect, useMemo, useRef, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Image, Upload, X } from 'lucide-react'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/UIKit/shadcn/ui/form'
import { MultiSelect } from '@/UIKit/shadcn/ui/multi-select'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/UIKit/shadcn/ui/select'
import { Label } from '@/UIKit/shadcn/ui/label'
import { useCountryOptions } from '@/modules/wine/create-wine/presenters/useCountryOptions'
import { cn } from '@/lib/utils'
import { IPartner, PARTNER_STATUS, PartnerImage } from '../../entities/types'
import { PartnerFormData, PartnerFormValues } from '../../presenters/partner-form-schema'
import { InputWithTooltip } from '@/UIKit/app-components/input-with-tooltip'

type PartnerImageValue = File | PartnerImage

const acceptedImageTypes = 'image/png,image/jpeg,image/jpg,image/gif,image/webp'

const getImageName = (image: PartnerImageValue) => image.name || ('originalName' in image ? image.originalName : '') || 'image'

const getImageUrl = (image?: PartnerImage | null) => image?.smallUrl || image?.mediumUrl || image?.originalUrl || ''

const ImagePreview = ({ image, className, imageClassName }: { image: PartnerImageValue; className?: string; imageClassName?: string }) => {
  const [previewUrl, setPreviewUrl] = useState('')

  useEffect(() => {
    if (image instanceof File) {
      const url = URL.createObjectURL(image)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }

    setPreviewUrl(getImageUrl(image))
  }, [image])

  if (!previewUrl) {
    return (
      <div className={cn('flex h-36 w-full items-center justify-center rounded-md bg-muted', className)}>
        <Image className="h-8 w-8 text-muted-foreground" />
      </div>
    )
  }

  return <img src={previewUrl} alt={getImageName(image)} className={cn('h-36 w-full rounded-md object-cover', className, imageClassName)} />
}

interface ImageUploadFieldProps {
  label: string
  uploadLabel: string
  changeLabel: string
  value?: File | null
  existingImage?: PartnerImage | null
  disabled?: boolean
  previewWrapperClassName?: string
  previewClassName?: string
  imageClassName?: string
  onChange: (file: File | null) => void
}

const ImageUploadField = ({ label, uploadLabel, changeLabel, value, existingImage, disabled, previewWrapperClassName, previewClassName, imageClassName, onChange }: ImageUploadFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const currentImage = value || existingImage || null

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onChange(file)
    }
    event.target.value = ''
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Card className="p-3 bg-background border-input">
        <input ref={inputRef} type="file" accept={acceptedImageTypes} onChange={handleChange} className="hidden" />
        {currentImage ? (
          <div className="space-y-3">
            <div className={cn('relative', previewWrapperClassName)}>
              <ImagePreview image={currentImage} className={previewClassName} imageClassName={imageClassName} />
              {value ? (
                <Button type="button" variant="outline" size="icon" className="absolute right-2 top-2 h-8 w-8 bg-background" onClick={() => onChange(null)} disabled={disabled}>
                  <X className="h-4 w-4" />
                </Button>
              ) : null}
            </div>
            <Button type="button" variant="outline" className="w-full min-w-0 gap-2 px-3 text-sm leading-tight whitespace-normal" onClick={() => inputRef.current?.click()} disabled={disabled}>
              <Upload className="h-4 w-4 shrink-0" />
              {changeLabel}
            </Button>
          </div>
        ) : (
          <button
            type="button"
            className={cn(
              'flex h-36 w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-input text-sm text-muted-foreground hover:bg-muted/50',
              previewClassName
            )}
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
          >
            <Upload className="h-8 w-8" />
            {uploadLabel}
          </button>
        )}
      </Card>
    </div>
  )
}

interface PartnerFormProps {
  form: UseFormReturn<PartnerFormValues, object, PartnerFormData>
  mode: 'create' | 'edit'
  partner?: IPartner
  onSubmit: (data: PartnerFormData) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export const PartnerForm = ({ form, mode, partner, onSubmit, onCancel, isSubmitting = false }: PartnerFormProps) => {
  const { t } = useTranslation('partners')
  const { t: tc } = useTranslation('common')
  const { fetchOptions: fetchCountryOptions, isLoading: countriesLoading, countries = [] } = useCountryOptions({})

  const watchedCountryIds = form.watch('countryIds')
  const countryIds = useMemo(() => watchedCountryIds || [], [watchedCountryIds])
  const logo = form.watch('logo') as File | null
  const image = form.watch('image') as File | null

  const selectedCountryOptions = useMemo(
    () =>
      countries
        .filter(country => countryIds.includes(country.id))
        .map(country => ({
          value: String(country.id),
          label: country.name,
        })),
    [countries, countryIds]
  )

  const handleCountriesChange = (value: string | string[]) => {
    const values = Array.isArray(value) ? value : [value]
    form.setValue(
      'countryIds',
      values.map(countryId => Number(countryId)).filter(countryId => !Number.isNaN(countryId)),
      { shouldDirty: true, shouldTouch: true, shouldValidate: true }
    )
  }

  const handleSubmit = (data: PartnerFormData) => {
    onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card className="rounded-t-none bg-input/50">
          <CardContent className="space-y-6 sm:px-0">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">{t('form.media_section')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ImageUploadField
                  label={t('form.logo')}
                  uploadLabel={t('form.upload_logo')}
                  changeLabel={t('form.change_logo')}
                  value={logo}
                  existingImage={partner?.logo}
                  disabled={isSubmitting}
                  previewWrapperClassName="mx-auto max-w-56"
                  previewClassName="mx-auto aspect-square h-auto max-h-56 max-w-56 bg-muted p-3"
                  imageClassName="object-contain"
                  onChange={file => form.setValue('logo', file, { shouldDirty: true, shouldValidate: true })}
                />
                <ImageUploadField
                  label={t('form.image')}
                  uploadLabel={t('form.upload_image')}
                  changeLabel={t('form.change_image')}
                  value={image}
                  existingImage={partner?.image}
                  disabled={isSubmitting}
                  onChange={file => form.setValue('image', file, { shouldDirty: true, shouldValidate: true })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.name') + '*'}</FormLabel>
                    <FormControl>
                      <InputWithTooltip {...field} placeholder={t('form.name_placeholder')} error={form.formState.errors.name?.message as string} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.website')}</FormLabel>
                    <FormControl>
                      <InputWithTooltip {...field} placeholder={t('form.website_placeholder')} error={form.formState.errors.website?.message as string} />
                    </FormControl>
                  </FormItem>
                )}
              />
              {mode === 'edit' && (
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.status')}</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                        <FormControl>
                          <SelectTrigger className="h-12 bg-background">
                            <SelectValue placeholder={t('form.status_placeholder')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={PARTNER_STATUS.ACTIVE}>{t('status.active')}</SelectItem>
                          <SelectItem value={PARTNER_STATUS.INACTIVE}>{t('status.inactive')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="countryIds"
                render={() => (
                  <FormItem className={mode === 'edit' ? '' : 'md:col-span-2'}>
                    <FormLabel>{t('form.countries')} *</FormLabel>
                    <FormControl>
                      <MultiSelect
                        value={countryIds.map(String)}
                        onChange={handleCountriesChange}
                        placeholder={countriesLoading ? tc('loading') : t('form.countries_placeholder')}
                        searchLabel={tc('search')}
                        fetchOptions={fetchCountryOptions}
                        itemOptions={selectedCountryOptions}
                        disabled={countriesLoading || isSubmitting}
                        mode="multiple"
                        enablePagination
                        error={form.formState.errors.countryIds?.message as string}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 md:flex-row flex-col">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            {tc('button.cancel')}
          </Button>
          <Button type="submit" className="min-w-32" disabled={isSubmitting}>
            {isSubmitting ? (mode === 'create' ? tc('button.creating') : tc('button.saving')) : mode === 'create' ? tc('button.create') : tc('button.save')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
