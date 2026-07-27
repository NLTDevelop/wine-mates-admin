/* global File, HTMLInputElement, URL */
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Image, Upload, X } from 'lucide-react'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { Form } from '@/UIKit/shadcn/ui/form'
import { FormFieldCombobox, IOption } from '@/UIKit/app-components/form-field-combobox'
import { YearPickerFormField } from '@/UIKit/app-components/year-picker-form-field'
import { NLTFormField } from '@/UIKit/components/NLTFormField'
import { Label } from '@/UIKit/shadcn/ui/label'
import { useCountryOptions } from '@/modules/wine/create-wine/presenters/useCountryOptions'
import { useRegionOptions } from '@/modules/wine/create-wine/presenters/useRegionOptions'
import { IWineryDetail } from '../../entities/types'
import { useEditWineryForm } from '../../presenters/useEditWineryForm'
import { MAX_WINERY_GALLERY_PHOTOS, WineryEditFormData, WineryEditFormValues } from '../../presenters/winery-edit-schema'

type WineryImageValue = File | NonNullable<IWineryDetail['mainPhoto']>

const acceptedImageTypes = 'image/png,image/jpeg,image/jpg,image/gif,image/webp'

const getImageName = (image: WineryImageValue) => image.name || ('originalName' in image ? image.originalName : '') || 'image'

const getImageId = (image: WineryImageValue): number | null => {
  if (image instanceof File || !image.id) return null
  const id = Number(image.id)
  return Number.isNaN(id) ? null : id
}

const ImagePreview = ({ image, className = 'h-36' }: { image: WineryImageValue; className?: string }) => {
  const [previewUrl, setPreviewUrl] = useState('')

  useEffect(() => {
    if (image instanceof File) {
      const url = URL.createObjectURL(image)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }

    setPreviewUrl(image.smallUrl || image.mediumUrl || image.originalUrl || '')
  }, [image])

  if (!previewUrl) {
    return (
      <div className={`${className} flex items-center justify-center rounded-md bg-muted`}>
        <Image className="h-8 w-8 text-muted-foreground" />
      </div>
    )
  }

  return <img src={previewUrl} alt={getImageName(image)} className={`${className} w-full rounded-md object-cover`} />
}

interface WineryProfileFormProps {
  form: UseFormReturn<WineryEditFormValues, object, WineryEditFormData>
  onSubmit: (data: WineryEditFormData) => Promise<void>
  onCancel: () => void
  onReset: () => void
  isSubmitting?: boolean
  hasChanges?: boolean
}

interface EditWineryFormProps {
  winery: IWineryDetail
  onSuccess?: () => void
  onCancel: () => void
}

const WineryProfileForm = ({ form, onSubmit, onCancel, onReset, isSubmitting = false, hasChanges = true }: WineryProfileFormProps) => {
  const { t } = useTranslation('winery')
  const { t: tc } = useTranslation('common')
  const mainPhotoInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const countryId = form.watch('countryId')
  const regionId = form.watch('regionId')
  const mainPhoto = form.watch('mainPhoto') as WineryImageValue | null
  const gallery = (form.watch('gallery') || []) as WineryImageValue[]
  const removeGalleryFileIds = form.watch('removeGalleryFileIds') || []

  const countryValue = countryId ? Number(countryId) : null

  const { fetchOptions: fetchCountryOptions, isLoading: countriesLoading, countries = [] } = useCountryOptions({})
  const {
    fetchOptions: fetchRegionOptions,
    isLoading: regionsLoading,
    regions = [],
  } = useRegionOptions({
    countryId: countryValue,
  })

  const selectedCountry = useMemo(() => countries.find(c => c.id.toString() === countryId || String(c.id) === countryId), [countries, countryId])

  const selectedRegion = useMemo(() => regions.find(r => r.id.toString() === regionId || String(r.id) === regionId), [regions, regionId])

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'countryId') {
        const newCountryId = value.countryId
        const currentCountryId = countryValue
        if (newCountryId !== currentCountryId && regionId) {
          form.setValue('regionId', null)
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [form, countryValue, regionId])

  const countryOptions = useMemo<IOption[]>(
    () =>
      countries.map(country => ({
        value: country.id.toString(),
        label: country.name,
      })),
    [countries]
  )

  const regionOptions = useMemo<IOption[]>(
    () =>
      regions.map(region => ({
        value: region.id.toString(),
        label: region.name,
      })),
    [regions]
  )

  useEffect(() => {
    if (countryOptions.length > 0 && countryId) {
      form.setValue('countryId', countryId, { shouldValidate: true })
    }
  }, [countryOptions, countryId, form])

  useEffect(() => {
    if (regionOptions.length > 0 && regionId) {
      form.setValue('regionId', regionId, { shouldValidate: true })
    }
  }, [regionOptions, regionId, form])

  const countryPlaceholder = selectedCountry ? selectedCountry.name : countriesLoading ? tc('loading') : t('form.winery_country_placeholder')

  const regionPlaceholder = selectedRegion ? selectedRegion.name : regionsLoading ? tc('loading') : t('form.region_placeholder')

  const handleSubmit = (data: WineryEditFormData) => {
    onSubmit(data)
  }

  const handleMainPhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      form.setValue('mainPhoto', file, { shouldDirty: true, shouldValidate: true })
    }
    event.target.value = ''
  }

  const handleGalleryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length) {
      const availableSlots = MAX_WINERY_GALLERY_PHOTOS - gallery.length
      const nextFiles = files.slice(0, Math.max(availableSlots, 0))

      if (files.length > availableSlots) {
        form.setError('gallery', { message: t('form.gallery_limit') })
      } else {
        form.clearErrors('gallery')
      }

      if (nextFiles.length) {
        form.setValue('gallery', [...gallery, ...nextFiles], { shouldDirty: true, shouldValidate: true })
      }
    }
    event.target.value = ''
  }

  const handleRemoveGalleryImage = (image: WineryImageValue) => {
    const imageId = getImageId(image)
    const nextGallery = gallery.filter(item => item !== image)

    form.setValue('gallery', nextGallery, { shouldDirty: true, shouldValidate: true })
    form.clearErrors('gallery')

    if (imageId && !removeGalleryFileIds.includes(imageId)) {
      form.setValue('removeGalleryFileIds', [...removeGalleryFileIds, imageId], { shouldDirty: true, shouldValidate: true })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card className="rounded-t-none bg-input/50">
          <CardContent className="space-y-6 sm:px-0">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">{t('form.media_section')}</h2>

              <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4">
                <div className="space-y-2">
                  <Label>{t('form.main_photo')}</Label>
                  <Card className="p-3 bg-background">
                    <input ref={mainPhotoInputRef} type="file" accept={acceptedImageTypes} onChange={handleMainPhotoChange} className="hidden" />
                    {mainPhoto ? (
                      <div className="space-y-3">
                        <div className="relative">
                          <ImagePreview image={mainPhoto} />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="absolute right-2 top-2 h-8 w-8 bg-background"
                            onClick={() => form.setValue('mainPhoto', null, { shouldDirty: true, shouldValidate: true })}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full min-w-0 gap-2 px-3 text-sm leading-tight whitespace-normal"
                          onClick={() => mainPhotoInputRef.current?.click()}
                          disabled={isSubmitting}
                        >
                          <Upload className="h-4 w-4 shrink-0" />
                          {t('form.change_main_photo')}
                        </Button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="flex h-36 w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-input text-sm text-muted-foreground hover:bg-muted/50"
                        onClick={() => mainPhotoInputRef.current?.click()}
                        disabled={isSubmitting}
                      >
                        <Upload className="h-8 w-8" />
                        {t('form.upload_main_photo')}
                      </button>
                    )}
                  </Card>
                </div>

                <div className="space-y-2">
                  <Label>{t('form.gallery')}</Label>
                  <Card className="p-3 bg-background">
                    <input ref={galleryInputRef} type="file" accept={acceptedImageTypes} onChange={handleGalleryChange} multiple className="hidden" />
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                      {gallery.map((image, index) => (
                        <div key={`${getImageName(image)}-${index}`} className="relative">
                          <ImagePreview image={image} className="h-28" />
                          <Button type="button" variant="outline" size="icon" className="absolute right-2 top-2 h-7 w-7 bg-background" onClick={() => handleRemoveGalleryImage(image)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {gallery.length < MAX_WINERY_GALLERY_PHOTOS && (
                        <button
                          type="button"
                          className="flex h-28 flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-input text-sm text-muted-foreground hover:bg-muted/50"
                          onClick={() => galleryInputRef.current?.click()}
                          disabled={isSubmitting}
                        >
                          <Upload className="h-6 w-6" />
                          {t('form.add_gallery_photo')}
                        </button>
                      )}
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{t('form.gallery_limit')}</p>
                    {form.formState.errors.gallery?.message && <p className="mt-2 text-sm text-destructive">{form.formState.errors.gallery.message as string}</p>}
                    {gallery.length === 0 && <p className="mt-3 text-sm text-muted-foreground">{t('form.gallery_empty')}</p>}
                  </Card>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NLTFormField form={form} name="name" formLabel={t('form.winery_name')} placeholder={t('form.winery_name_placeholder')} required />
              <YearPickerFormField
                form={form}
                name="foundedYear"
                label={t('form.founded_year')}
                placeholder={t('form.founded_year_placeholder')}
                fromYear={1000}
                toYear={new Date().getFullYear()}
                required
              />
              <FormFieldCombobox
                form={form}
                formLabel={t('form.winery_country') + '*'}
                name="countryId"
                placeholder={countryPlaceholder}
                searchLabel={tc('search')}
                fetchOptions={fetchCountryOptions}
                options={countryOptions}
                disabled={countriesLoading}
                showX={false}
              />
              <FormFieldCombobox
                form={form}
                formLabel={t('form.region')}
                name="regionId"
                placeholder={regionPlaceholder}
                searchLabel={tc('search')}
                fetchOptions={fetchRegionOptions}
                options={regionOptions}
                disabled={!countryId || regionsLoading}
              />
              <div className="md:col-span-2">
                <NLTFormField
                  form={form}
                  name="description"
                  formLabel={t('form.description')}
                  placeholder={t('form.description_placeholder')}
                  textArea
                  textAreaMinHeight={140}
                  maxLength={3000}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <NLTFormField form={form} name="links" formLabel={t('form.links')} placeholder={t('form.links_placeholder')} textArea textAreaMinHeight={96} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 md:flex-row flex-col justify-between">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            {t('button.go_detail')}
          </Button>

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={onReset} disabled={!hasChanges || isSubmitting} className="flex-1">
              {tc('button.cancel')}
            </Button>
            <Button type="submit" className="min-w-32 flex-1" disabled={isSubmitting || !hasChanges}>
              {isSubmitting ? tc('button.saving') : tc('button.save')}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}

export const EditWineryForm = ({ winery, onSuccess, onCancel }: EditWineryFormProps) => {
  const { form, isSubmitting, hasChanges, onSubmit, resetForm } = useEditWineryForm({ winery, onSuccess })

  return <WineryProfileForm form={form} onSubmit={onSubmit} onCancel={onCancel} onReset={resetForm} isSubmitting={isSubmitting} hasChanges={hasChanges} />
}
