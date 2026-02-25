import { IOption } from '@/UIKit/components/NLTFormCombobox'
import { NLTComplexComboboxFormFieldData } from '@/UIKit/components/NLTFormComplexComboboxData'
import { NLTModal } from '@/UIKit/components/NLTModal'
import { Button } from '@/UIKit/shadcn/ui/button'
import { FormProvider, UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export interface UniqueValues {
  names: IOption[]
  vintages: IOption[]
  countries: IOption[]
  regions: IOption[]
  producers: IOption[]
  grapeVarieties: IOption[]
  types: IOption[]
  colors: IOption[]
  images: IOption[]
}

export interface UnionWinesModalProps {
  isOpen: boolean
  onClose: () => void
  form: UseFormReturn<any>
  onCreateOption: (data: string, fieldName: string) => Promise<IOption | null>
  onSubmit: (data: any) => void | Promise<void>
  uniqueValues?: UniqueValues
}

export const UnionWinesModal: React.FC<UnionWinesModalProps> = ({ isOpen, onClose, form, onCreateOption, onSubmit, uniqueValues }) => {
  const { t } = useTranslation('wines')
  return (
    <NLTModal isOpen={isOpen} onClose={onClose} title={t('merge.merge_wines')} className="max-w-[700px]">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <div className="space-y-4">
            {uniqueValues?.images && uniqueValues.images.length > 0 && (
              <NLTComplexComboboxFormFieldData form={form} name="image" formLabel={t('images')} placeholder={t('merge.chose_image')} options={uniqueValues.images} is_dynamic={false} />
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NLTComplexComboboxFormFieldData
              form={form}
              name="typeId"
              formLabel={t('wine_type') + '*'}
              placeholder={t('merge.chose_or_type', { field: t('merge.type') })}
              options={uniqueValues?.types || []}
              is_dynamic={false}
              onCreateOption={onCreateOption}
            />
            <NLTComplexComboboxFormFieldData
              form={form}
              name="colorId"
              formLabel={t('color') + '*'}
              placeholder={t('merge.chose_or_type', { field: t('merge.color') })}
              options={uniqueValues?.colors || []}
              is_dynamic={false}
              onCreateOption={onCreateOption}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NLTComplexComboboxFormFieldData
              form={form}
              name="name"
              formLabel={t('wine_name')}
              placeholder={t('merge.chose_or_type', { field: t('merge.name') })}
              searchLabel={t('merge.search_or_create')}
              options={uniqueValues?.names || []}
              is_dynamic={true}
              onCreateOption={onCreateOption}
            />
            <NLTComplexComboboxFormFieldData
              form={form}
              name="producer"
              formLabel={t('table.producertitle') + '*'}
              searchLabel={t('merge.search_or_create')}
              placeholder={t('merge.chose_or_type', { field: t('merge.producer') })}
              options={uniqueValues?.producers || []}
              is_dynamic={true}
              onCreateOption={onCreateOption}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NLTComplexComboboxFormFieldData
              form={form}
              name="vintage"
              formLabel={t('vintage_config')}
              searchLabel={t('merge.search_or_create')}
              placeholder={t('merge.chose_or_type', { field: t('merge.year') })}
              options={uniqueValues?.vintages || []}
              is_dynamic={true}
              onCreateOption={onCreateOption}
            />
            <NLTComplexComboboxFormFieldData
              form={form}
              name="grapeVariety"
              formLabel={t('grape_variety') + '*'}
              searchLabel={t('merge.search_or_create')}
              placeholder={t('merge.chose_or_type', { field: t('merge.grape_variety') })}
              options={uniqueValues?.grapeVarieties || []}
              is_dynamic={true}
              onCreateOption={onCreateOption}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NLTComplexComboboxFormFieldData
              form={form}
              name="countryId"
              formLabel={t('country') + '*'}
              placeholder={t('merge.chose_or_type', { field: t('merge.country') })}
              options={uniqueValues?.countries || []}
              is_dynamic={false}
              onCreateOption={onCreateOption}
            />

            <NLTComplexComboboxFormFieldData
              form={form}
              name="regionId"
              formLabel={t('region')}
              placeholder={t('merge.chose_or_type', { field: t('merge.region') })}
              options={uniqueValues?.regions || []}
              is_dynamic={false}
              onCreateOption={onCreateOption}
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              {t('button.cancel')}
            </Button>
            <Button type="submit">{t('button.merge')}</Button>
          </div>
        </form>
      </FormProvider>
    </NLTModal>
  )
}
